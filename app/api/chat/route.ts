import { NextRequest, NextResponse } from "next/server";
import { generateContentStreamWithFallback } from "@/lib/chat/gemini-generate";
import { formatGeminiError } from "@/lib/chat/gemini-errors";
import { prepareInventoryChat, saveChatMessages } from "@/lib/chat/prepare-chat";
import { getSession } from "@/lib/chat/session-manager";
import { requireAuthCookie } from "@/lib/chat/auth-api";
import type { InventoryChatRequest } from "@/types/chat";

export const runtime = "nodejs";
export const maxDuration = 90;

export async function POST(req: NextRequest) {
  if (!requireAuthCookie(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: InventoryChatRequest = await req.json();
    const {
      sessionId,
      userId,
      message,
      useWebSearch = true,
      inventorySnapshot = [],
    } = body;

    if (!sessionId || !userId || !message?.trim()) {
      return NextResponse.json(
        { error: "sessionId, userId, and message are required" },
        { status: 400 }
      );
    }

    const session = await getSession(userId, sessionId);
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const { prompt, useWebSearch: webOn } = await prepareInventoryChat(
      userId,
      sessionId,
      message.trim(),
      inventorySnapshot,
      useWebSearch
    );

    const encoder = new TextEncoder();
    let fullResponse = "";

    const readable = new ReadableStream({
      async start(controller) {
        try {
          if (webOn) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ status: "searching_web" })}\n\n`
              )
            );
          }

          const { stream } = await generateContentStreamWithFallback(prompt, {
            useWebSearch: webOn,
          });

          for await (const chunk of stream) {
            const text = chunk.text ?? "";
            if (text) {
              fullResponse += text;
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
              );
            }
          }

          await saveChatMessages(userId, sessionId, message.trim(), fullResponse);
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: formatGeminiError(err) })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("[/api/chat]", err);
    return NextResponse.json(
      { error: formatGeminiError(err) },
      { status: 500 }
    );
  }
}

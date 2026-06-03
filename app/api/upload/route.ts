import { NextRequest, NextResponse } from "next/server";
import { requireAuthCookie } from "@/lib/chat/auth-api";
import { getSession } from "@/lib/chat/session-manager";
import { parseDocument, validateFile } from "@/lib/utils/document-parser";
import { chunkText } from "@/lib/utils/chunker";
import { storeDocumentChunks } from "@/lib/chroma/store";
import { isChromaConfigured } from "@/lib/chroma/client";
import type { UploadResponse } from "@/types/chat";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  if (!requireAuthCookie(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isChromaConfigured()) {
    return NextResponse.json(
      {
        error:
          "ChromaDB is not configured. Add CHROMA_API_KEY, CHROMA_TENANT, and CHROMA_DATABASE to .env.local.",
      },
      { status: 503 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const sessionId = formData.get("sessionId") as string | null;
    const userId = formData.get("userId") as string | null;

    if (!file || !sessionId || !userId) {
      return NextResponse.json(
        { error: "file, sessionId, and userId are required" },
        { status: 400 }
      );
    }

    const session = await getSession(userId, sessionId);
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const validation = validateFile(file.name, file.size);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const text = await parseDocument(buffer, file.name);
    const chunks = await chunkText(text);

    if (!chunks.length) {
      return NextResponse.json(
        { error: "No text content could be extracted from the document." },
        { status: 400 }
      );
    }

    const fileType = file.name.toLowerCase().endsWith(".pdf")
      ? "pdf"
      : file.name.toLowerCase().endsWith(".docx")
        ? "docx"
        : "txt";

    const chunksStored = await storeDocumentChunks(
      userId,
      file.name,
      fileType,
      chunks
    );

    const response: UploadResponse = {
      success: true,
      filename: file.name,
      chunksStored,
      message: `Processed "${file.name}" — ${chunksStored} chunks indexed for your account.`,
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error("[/api/upload]", err);
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/chat/session-manager";
import { requireAuthCookie } from "@/lib/chat/auth-api";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  if (!requireAuthCookie(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = req.nextUrl.searchParams.get("userId");
  const sessionId = req.nextUrl.searchParams.get("sessionId");

  if (!userId || !sessionId) {
    return NextResponse.json(
      { error: "userId and sessionId are required" },
      { status: 400 }
    );
  }

  const session = await getSession(userId, sessionId);
  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  return NextResponse.json({ session });
}

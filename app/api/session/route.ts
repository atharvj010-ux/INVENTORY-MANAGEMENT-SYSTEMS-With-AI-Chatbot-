import { NextRequest, NextResponse } from "next/server";
import {
  createSession,
  listSessions,
  deleteSession,
} from "@/lib/chat/session-manager";
import { requireAuthCookie } from "@/lib/chat/auth-api";

export const runtime = "nodejs";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(req: NextRequest) {
  if (!requireAuthCookie(req)) return unauthorized();

  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const sessions = await listSessions(userId);
  return NextResponse.json({ sessions });
}

export async function POST(req: NextRequest) {
  if (!requireAuthCookie(req)) return unauthorized();

  const { userId, title } = await req.json();
  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const session = await createSession(userId, title);
  return NextResponse.json({ session }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  if (!requireAuthCookie(req)) return unauthorized();

  const userId = req.nextUrl.searchParams.get("userId");
  const id = req.nextUrl.searchParams.get("id");
  if (!userId || !id) {
    return NextResponse.json(
      { error: "userId and id are required" },
      { status: 400 }
    );
  }

  const ok = await deleteSession(userId, id);
  if (!ok) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}

import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import type { ChatMessage, Session, SessionData } from "@/types/chat";

function userSessionsDir(userId: string): string {
  return path.join(process.cwd(), "data", "chat-sessions", userId);
}

function sessionPath(userId: string, sessionId: string): string {
  return path.join(userSessionsDir(userId), `${sessionId}.json`);
}

async function ensureDir(userId: string): Promise<void> {
  await fs.mkdir(userSessionsDir(userId), { recursive: true });
}

export async function createSession(
  userId: string,
  title?: string
): Promise<SessionData> {
  await ensureDir(userId);
  const now = new Date().toISOString();
  const session: SessionData = {
    id: uuidv4(),
    title: title || "Inventory chat",
    createdAt: now,
    updatedAt: now,
    messageCount: 0,
    messages: [],
  };
  await fs.writeFile(
    sessionPath(userId, session.id),
    JSON.stringify(session, null, 2)
  );
  return session;
}

export async function getSession(
  userId: string,
  sessionId: string
): Promise<SessionData | null> {
  try {
    const data = await fs.readFile(sessionPath(userId, sessionId), "utf-8");
    return JSON.parse(data) as SessionData;
  } catch {
    return null;
  }
}

export async function listSessions(userId: string): Promise<Session[]> {
  await ensureDir(userId);
  const files = await fs.readdir(userSessionsDir(userId));
  const sessions: Session[] = [];

  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    try {
      const data = await fs.readFile(
        path.join(userSessionsDir(userId), file),
        "utf-8"
      );
      const s = JSON.parse(data) as SessionData;
      sessions.push({
        id: s.id,
        title: s.title,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
        messageCount: s.messageCount,
      });
    } catch {
      /* skip */
    }
  }

  return sessions.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export async function addMessage(
  userId: string,
  sessionId: string,
  role: "user" | "assistant",
  content: string
): Promise<ChatMessage> {
  const session = await getSession(userId, sessionId);
  if (!session) throw new Error("Session not found");

  const message: ChatMessage = {
    id: uuidv4(),
    role,
    content,
    timestamp: new Date().toISOString(),
  };

  session.messages.push(message);
  session.messageCount = session.messages.length;
  session.updatedAt = message.timestamp;

  if (session.messageCount === 1 && role === "user") {
    session.title =
      content.slice(0, 48) + (content.length > 48 ? "…" : "");
  }

  await fs.writeFile(
    sessionPath(userId, sessionId),
    JSON.stringify(session, null, 2)
  );
  return message;
}

export async function getConversationHistory(
  userId: string,
  sessionId: string,
  limit = 12
): Promise<ChatMessage[]> {
  const session = await getSession(userId, sessionId);
  if (!session) return [];
  return session.messages.slice(-limit);
}

export async function deleteSession(
  userId: string,
  sessionId: string
): Promise<boolean> {
  try {
    await fs.unlink(sessionPath(userId, sessionId));
    return true;
  } catch {
    return false;
  }
}

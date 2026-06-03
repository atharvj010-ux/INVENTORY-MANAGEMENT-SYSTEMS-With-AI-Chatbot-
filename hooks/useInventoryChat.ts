"use client";

import { useState, useCallback } from "react";
import type { ChatMessage } from "@/types/chat";
import type { InventorySnapshot } from "@/lib/chat/inventory-context";

export function useInventoryChat(userId: string | undefined) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSearchingWeb, setIsSearchingWeb] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  const ensureSession = useCallback(async (): Promise<string | null> => {
    if (!userId) return null;
    if (sessionId) return sessionId;

    const res = await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    setSessionId(data.session.id);
    return data.session.id as string;
  }, [userId, sessionId]);

  const loadHistory = useCallback(
    async (sid: string) => {
      if (!userId) return;
      const res = await fetch(
        `/api/history?userId=${userId}&sessionId=${sid}`
      );
      if (!res.ok) return;
      const data = await res.json();
      setMessages(data.session.messages ?? []);
      setSessionId(sid);
      setError(null);
    },
    [userId]
  );

  const newChat = useCallback(async () => {
    if (!userId) return;
    const res = await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    if (!res.ok) return;
    const data = await res.json();
    setSessionId(data.session.id);
    setMessages([]);
    setError(null);
  }, [userId]);

  const sendMessage = useCallback(
    async (
      text: string,
      inventorySnapshot: InventorySnapshot[],
      useWebSearch: boolean
    ) => {
      if (!userId || !text.trim() || isStreaming) return;

      const sid = await ensureSession();
      if (!sid) {
        setError("Could not start chat session");
        return;
      }

      setError(null);
      setIsStreaming(true);
      setIsSearchingWeb(false);

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: text.trim(),
        timestamp: new Date().toISOString(),
      };
      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: sid,
            userId,
            message: text.trim(),
            useWebSearch,
            inventorySnapshot,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Chat failed");
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No stream");

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const payload = line.slice(6);
            if (payload === "[DONE]") continue;
            try {
              const parsed = JSON.parse(payload);
              if (parsed.error) throw new Error(parsed.error);
              if (parsed.status === "searching_web") {
                setIsSearchingWeb(true);
                continue;
              }
              if (parsed.text) {
                setIsSearchingWeb(false);
                setMessages((prev) => {
                  const next = [...prev];
                  const last = next[next.length - 1];
                  if (last?.role === "assistant") {
                    next[next.length - 1] = {
                      ...last,
                      content: last.content + parsed.text,
                    };
                  }
                  return next;
                });
              }
            } catch {
              /* skip bad chunk */
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Chat failed");
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last?.role === "assistant" && !last.content) next.pop();
          return next;
        });
      } finally {
        setIsStreaming(false);
        setIsSearchingWeb(false);
      }
    },
    [userId, isStreaming, ensureSession]
  );

  const uploadDocument = useCallback(
    async (file: File) => {
      if (!userId || isUploading) return;

      const sid = await ensureSession();
      if (!sid) {
        setError("Could not start chat session for upload");
        return;
      }

      setIsUploading(true);
      setError(null);
      setUploadNotice(null);

      try {
        const form = new FormData();
        form.append("file", file);
        form.append("sessionId", sid);
        form.append("userId", userId);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: form,
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Upload failed");
        }

        setUploadNotice(data.message as string);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setIsUploading(false);
      }
    },
    [userId, isUploading, ensureSession]
  );

  return {
    messages,
    sessionId,
    isStreaming,
    isSearchingWeb,
    isUploading,
    uploadNotice,
    error,
    sendMessage,
    uploadDocument,
    loadHistory,
    newChat,
  };
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, Plus, Send, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useInventoryChat } from "@/hooks/useInventoryChat";
import { ChatUploadButton } from "@/components/chat/ChatUploadButton";
import { toSnapshot } from "@/lib/chat/inventory-context";
import type { InventoryItem } from "@/types/inventory";

type Props = {
  userId: string;
  items: InventoryItem[];
};

export function InventoryChatPanel({ userId, items }: Props) {
  const [input, setInput] = useState("");
  const [useWebSearch, setUseWebSearch] = useState(true);
  const {
    messages,
    isStreaming,
    isSearchingWeb,
    error,
    uploadNotice,
    isUploading,
    sendMessage,
    uploadDocument,
    newChat,
  } = useInventoryChat(userId);

  const snapshot = toSnapshot(items);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input, snapshot, useWebSearch);
    setInput("");
  };

  return (
    <div className="glass glow-border flex h-[calc(100vh-12rem)] min-h-[480px] flex-col overflow-hidden rounded-2xl">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent-cyan" />
          <div>
            <p className="text-sm font-semibold">Inventory AI Assistant</p>
            <p className="text-xs text-zinc-500">
              {items.length} items · Chroma RAG · web {useWebSearch ? "on" : "off"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => newChat()}
          className="flex items-center gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1.5 text-xs text-zinc-500 hover:bg-[var(--color-surface-hover)]"
        >
          <Plus className="h-3.5 w-3.5" />
          New chat
        </button>
      </div>

      {error ? (
        <div className="mx-4 mt-3 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
          {error}
        </div>
      ) : null}

      {uploadNotice ? (
        <div className="mx-4 mt-3 rounded-lg border border-accent-cyan/30 bg-accent-cyan/10 px-3 py-2 text-sm text-accent-cyan">
          {uploadNotice}
        </div>
      ) : null}

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-zinc-500">
            <p className="max-w-sm text-sm">
              Ask about stock levels, reorder suggestions, or upload supplier
              PDFs/DOCX. Live inventory ({items.length} items) syncs to your
              Chroma knowledge base on each message.
            </p>
            <ul className="mt-4 space-y-1 text-left text-xs text-zinc-600">
              <li>· Which items need restocking?</li>
              <li>· Summarize my inventory by category</li>
              <li>· What are current trends for warehouse tech?</li>
            </ul>
          </div>
        ) : (
          messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`max-w-[90%] rounded-xl px-3 py-2 text-sm ${
                msg.role === "user"
                  ? "ml-auto bg-accent-cyan/15 text-white"
                  : "bg-white/5 text-zinc-200"
              }`}
            >
              {msg.role === "assistant" && !msg.content && (isSearchingWeb || isStreaming) ? (
                <span className="text-xs text-accent-cyan animate-pulse">
                  {isSearchingWeb ? "Searching the web…" : "Thinking…"}
                </span>
              ) : msg.role === "assistant" ? (
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}
            </motion.div>
          ))
        )}
      </div>

      <div className="border-t border-[var(--color-border)] p-3">
        <div className="chat-composer flex items-end gap-2 rounded-xl border p-2">
          <ChatUploadButton
            onUpload={uploadDocument}
            isUploading={isUploading}
            disabled={isStreaming}
          />
          <button
            type="button"
            onClick={() => setUseWebSearch((v) => !v)}
            title="Toggle web search"
            className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border transition ${
              useWebSearch
                ? "border-accent-cyan/40 bg-accent-cyan/10 text-accent-cyan"
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-zinc-500"
            }`}
          >
            <Globe className="h-4 w-4" />
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask about your inventory…"
            rows={1}
            disabled={isStreaming}
            className="max-h-28 flex-1 resize-none bg-transparent py-2 text-sm text-[var(--color-text)] outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-accent-cyan to-accent-purple text-white disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

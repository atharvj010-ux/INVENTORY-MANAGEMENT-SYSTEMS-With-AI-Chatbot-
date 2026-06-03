"use client";

import { motion } from "framer-motion";
import { InventoryChatPanel } from "@/components/chat/InventoryChatPanel";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { useInventory } from "@/hooks/useInventory";
import Link from "next/link";

export default function AIAssistantPage() {
  const { user } = useAuthContext();
  const { items, loading } = useInventory(user?.uid);

  if (!user) {
    return (
      <p className="text-zinc-500">
        Please{" "}
        <Link href="/login" className="text-accent-cyan underline">
          sign in
        </Link>{" "}
        to use the AI assistant.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">
          AI <span className="text-gradient">Assistant</span>
        </h1>
        <p className="mt-1 text-zinc-500">
          Linked to your gemini-rag-chatbot stack: Gemini + Chroma RAG, live
          Firestore inventory, document uploads, and web search.
        </p>
      </motion.div>

      {loading ? (
        <p className="text-zinc-500">Loading inventory…</p>
      ) : (
        <InventoryChatPanel userId={user.uid} items={items} />
      )}
    </div>
  );
}

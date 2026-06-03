"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { AIInsightsPanel } from "@/components/ai/AIInsightsPanel";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { useInventory } from "@/hooks/useInventory";

export default function AIInsightsPage() {
  const { user } = useAuthContext();
  const { items, loading } = useInventory(user?.uid);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">
          AI <span className="text-gradient">Insights</span>
        </h1>
        <p className="mt-1 text-zinc-500">
          Predictive shortages, health scoring, and smart restock suggestions.{" "}
          <Link
            href="/dashboard/ai-assistant"
            className="text-accent-cyan hover:underline"
          >
            Open full AI chat →
          </Link>
        </p>
      </motion.div>

      {!loading ? (
        <AIInsightsPanel items={items} />
      ) : (
        <p className="text-zinc-500">Analyzing inventory...</p>
      )}
    </div>
  );
}

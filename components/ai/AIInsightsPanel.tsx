"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Brain, RefreshCw, TrendingUp } from "lucide-react";
import {
  inventoryHealthScore,
  predictShortages,
  restockSuggestions,
} from "@/lib/ai-mock";
import type { InventoryItem } from "@/types/inventory";

type Props = { items: InventoryItem[] };

export function AIInsightsPanel({ items }: Props) {
  const score = inventoryHealthScore(items);
  const shortages = predictShortages(items);
  const restocks = restockSuggestions(items);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass glow-border p-6 lg:col-span-1"
      >
        <div className="flex items-center gap-2 text-accent-cyan">
          <Brain className="h-5 w-5" />
          <span className="text-sm font-medium">Inventory Health</span>
        </div>
        <div className="mt-6 flex items-center justify-center">
          <div
            className="relative flex h-36 w-36 items-center justify-center rounded-full"
            style={{
              background: `conic-gradient(#00F5FF ${score}%, var(--health-gauge-track) 0)`,
            }}
          >
            <div className="health-gauge-center flex h-28 w-28 flex-col items-center justify-center rounded-full">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">{score}</span>
              <span className="text-xs text-zinc-500">/ 100</span>
            </div>
          </div>
        </div>
        <p className="mt-4 text-center text-sm text-zinc-400">
          AI-computed health based on stock levels and status distribution.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass p-6 lg:col-span-1"
      >
        <div className="flex items-center gap-2 text-amber-300">
          <AlertTriangle className="h-5 w-5" />
          <span className="text-sm font-medium">Predicted Shortages</span>
        </div>
        <ul className="mt-4 space-y-3">
          {shortages.length ? (
            shortages.map((s) => (
              <li
                key={s.item}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm"
              >
                <span>{s.item}</span>
                <span className="text-zinc-500">
                  ~{s.daysUntilStockout}d · {Math.round(s.confidence * 100)}%
                </span>
              </li>
            ))
          ) : (
            <li className="text-sm text-zinc-500">No shortages predicted.</li>
          )}
        </ul>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass p-6 lg:col-span-1"
      >
        <div className="flex items-center gap-2 text-accent-purple">
          <RefreshCw className="h-5 w-5" />
          <span className="text-sm font-medium">Smart Restock</span>
        </div>
        <ul className="mt-4 space-y-3">
          {restocks.length ? (
            restocks.map((r) => (
              <li
                key={r.item}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm"
              >
                <div className="flex items-center justify-between font-medium">
                  <span>{r.item}</span>
                  <span className="text-accent-cyan">+{r.suggestedQty}</span>
                </div>
                <p className="mt-1 text-xs text-zinc-500">{r.reason}</p>
              </li>
            ))
          ) : (
            <li className="text-sm text-zinc-500">Stock levels look healthy.</li>
          )}
        </ul>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="glass flex items-center gap-3 p-4 lg:col-span-3"
      >
        <TrendingUp className="h-5 w-5 text-accent-cyan" />
        <p className="text-sm text-zinc-400">
          <span className="font-medium text-[var(--color-text)]">AI Recommendation:</span> Prioritize
          restocking {restocks[0]?.item || "high-velocity SKUs"} and review categories with
          declining turnover in Analytics.
        </p>
      </motion.div>
    </div>
  );
}

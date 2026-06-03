"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  Box,
  Package,
  Sparkles,
  TrendingUp,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { useInventory } from "@/hooks/useInventory";
import { aiPredictionCount } from "@/lib/ai-mock";
import { CardSkeleton } from "@/components/ui/LoadingSkeleton";
import { Button } from "@/components/ui/Button";

export default function DashboardOverviewPage() {
  const { user } = useAuthContext();
  const { items, loading, stats } = useInventory(user?.uid);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold md:text-3xl">
          Dashboard <span className="text-gradient">Overview</span>
        </h1>
        <p className="mt-1 text-zinc-500">
          Real-time inventory intelligence at a glance.
        </p>
      </motion.div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <DashboardCard
            title="Total Inventory"
            value={stats.total}
            icon={Package}
            trend={12}
            accent="cyan"
            delay={0}
          />
          <DashboardCard
            title="In Stock"
            value={stats.inStock}
            icon={Box}
            trend={8}
            accent="blue"
            delay={0.05}
          />
          <DashboardCard
            title="Low Stock"
            value={stats.lowStock}
            icon={AlertTriangle}
            trend={-4}
            accent="pink"
            delay={0.1}
          />
          <DashboardCard
            title="Out of Stock"
            value={stats.outOfStock}
            icon={XCircle}
            trend={-2}
            accent="purple"
            delay={0.15}
          />
          <DashboardCard
            title="AI Predictions"
            value={aiPredictionCount(items)}
            icon={Sparkles}
            accent="cyan"
            delay={0.2}
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass p-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Recent Activity</h2>
            <Link href="/dashboard/inventory">
              <Button variant="ghost">View all</Button>
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {items.slice(0, 5).map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
              >
                <span>{item.itemName}</span>
                <span className="text-zinc-500">Qty {item.quantity}</span>
              </li>
            ))}
            {!items.length ? (
              <li className="text-sm text-zinc-500">No items yet. Add inventory to get started.</li>
            ) : null}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass glow-border p-6"
        >
          <div className="flex items-center gap-2 text-accent-cyan">
            <Sparkles className="h-5 w-5" />
            <h2 className="font-semibold">AI Quick Insight</h2>
          </div>
          <p className="mt-4 text-sm text-zinc-400 leading-relaxed">
            {stats.lowStock + stats.outOfStock > 0
              ? `${stats.lowStock + stats.outOfStock} SKUs need attention. Review AI Insights for smart restock recommendations.`
              : "Inventory health looks strong. AI monitoring is active across all categories."}
          </p>
          <Link href="/dashboard/ai-insights" className="mt-4 inline-block">
            <Button variant="gradient">
              Open AI Insights <TrendingUp className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

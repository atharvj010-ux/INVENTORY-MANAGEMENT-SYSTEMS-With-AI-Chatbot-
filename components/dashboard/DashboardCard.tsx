"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { formatNumber } from "@/utils/format";

type Props = {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: number;
  accent?: "cyan" | "purple" | "pink" | "blue";
  delay?: number;
};

const accentMap = {
  cyan: "from-accent-cyan/30 to-accent-cyan/5 text-accent-cyan",
  purple: "from-accent-purple/30 to-accent-purple/5 text-accent-purple",
  pink: "from-accent-pink/30 to-accent-pink/5 text-accent-pink",
  blue: "from-accent-blue/30 to-accent-blue/5 text-accent-blue",
};

export function DashboardCard({
  title,
  value,
  icon: Icon,
  trend,
  accent = "cyan",
  delay = 0,
}: Props) {
  const up = trend !== undefined && trend >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="glass group relative overflow-hidden p-5 transition hover:glow-border dark:hover:glow-border"
    >
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-accent-cyan/30 via-accent-purple/20 to-accent-pink/20 opacity-30 blur-2xl transition group-hover:opacity-50 dark:from-accent-cyan/20 dark:opacity-20" />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-zinc-500">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-[var(--color-text)]">
            {typeof value === "number" ? formatNumber(value) : value}
          </p>
          {trend !== undefined ? (
            <div
              className={`mt-2 inline-flex items-center gap-1 text-xs ${up ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}
            >
              {up ? (
                <ArrowUpRight className="h-3.5 w-3.5" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5" />
              )}
              {Math.abs(trend)}% vs last week
            </div>
          ) : null}
        </div>
        <div
          className={`rounded-xl bg-gradient-to-br p-3 ${accentMap[accent]}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}

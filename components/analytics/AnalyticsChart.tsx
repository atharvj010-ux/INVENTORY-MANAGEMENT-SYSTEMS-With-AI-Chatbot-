"use client";

import { motion } from "framer-motion";

type Props = {
  data: number[];
  labels?: string[];
  title: string;
  color?: string;
  height?: number;
};

export function AnalyticsChart({
  data,
  labels,
  title,
  color = "#00F5FF",
  height = 160,
}: Props) {
  const max = Math.max(...data, 1);
  const defaultLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const lbls = labels || defaultLabels.slice(0, data.length);

  return (
    <div className="glass p-5">
      <h3 className="mb-4 text-sm font-medium text-zinc-400">{title}</h3>
      <div className="flex items-end gap-2" style={{ height }}>
        {data.map((v, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-2">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(v / max) * 100}%` }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className="w-full min-h-[4px] rounded-t-lg"
              style={{
                background: `linear-gradient(to top, ${color}88, ${color})`,
                boxShadow: `0 0 20px ${color}44`,
              }}
            />
            <span className="text-[10px] text-zinc-500">{lbls[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DonutBreakdown({
  items,
  title,
}: {
  items: { name: string; value: number }[];
  title: string;
}) {
  const total = items.reduce((s, i) => s + i.value, 0) || 1;
  const colors = ["#00F5FF", "#7C3AED", "#EC4899", "#3B82F6", "#22d3ee", "#a78bfa"];

  let offset = 0;
  const segments = items.map((item, i) => {
    const pct = (item.value / total) * 100;
    const seg = { ...item, pct, color: colors[i % colors.length], offset };
    offset += pct;
    return seg;
  });

  return (
    <div className="glass p-5">
      <h3 className="mb-4 text-sm font-medium text-zinc-400">{title}</h3>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div
          className="mx-auto h-32 w-32 rounded-full"
          style={{
            background: `conic-gradient(${segments.map((s) => `${s.color} ${s.offset}% ${s.offset + s.pct}%`).join(", ")})`,
          }}
        />
        <ul className="flex-1 space-y-2">
          {segments.map((s) => (
            <li key={s.name} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-zinc-300">
                <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                {s.name}
              </span>
              <span className="text-zinc-500">{Math.round(s.pct)}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

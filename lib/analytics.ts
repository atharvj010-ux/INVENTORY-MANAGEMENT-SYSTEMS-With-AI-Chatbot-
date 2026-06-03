import type { InventoryItem } from "@/types/inventory";
import { normalizeStatus } from "@/utils/status";

export function calcStockMovement(items: InventoryItem[]) {
  const total = items.reduce((a, b) => a + (Number(b.quantity) || 0), 0);
  const low = items.filter((i) => normalizeStatus(String(i.status)) === "low_stock").length;
  const out = items.filter((i) => normalizeStatus(String(i.status)) === "out_of_stock").length;
  const active = items.length - low - out;

  const base = total / Math.max(1, items.length);
  const series = Array.from({ length: 7 }).map((_, idx) => {
    const t = idx / 6;
    const drift = (active - low) * (0.04 + t * 0.02);
    const risk = out * (0.06 + t * 0.03);
    const noise = Math.sin((idx + 1) * 1.7) * 0.03;
    return Math.round(Math.max(0, base * (1 + drift - risk + noise)));
  });

  return { series, total, counts: { active, low, out } };
}

export function calcRevenueSimulation(items: InventoryItem[]) {
  const catBoost = (c: string) => {
    const s = c.toLowerCase();
    if (s.includes("electronics")) return 1.35;
    if (s.includes("office")) return 1.15;
    if (s.includes("food")) return 1.05;
    if (s.includes("apparel")) return 1.25;
    return 1.0;
  };

  const inventoryValue = items.reduce((sum, i) => {
    const q = Number(i.quantity) || 0;
    return sum + q * catBoost(i.category || "") * 10;
  }, 0);

  const weekly = Array.from({ length: 7 }).map((_, idx) => {
    const t = idx / 6;
    const seasonal = 1 + Math.sin((idx + 1) * 0.9) * 0.08;
    const churn = 1 - t * 0.04;
    const noise = Math.cos((idx + 1) * 0.7) * 0.03;
    return Math.round(inventoryValue * 0.015 * seasonal * churn * (1 + noise));
  });

  return { weekly, totalRevenue: weekly.reduce((a, b) => a + b, 0) };
}

export function categoryBreakdown(items: InventoryItem[]) {
  const map = new Map<string, number>();
  for (const i of items) {
    map.set(i.category, (map.get(i.category) || 0) + i.quantity);
  }
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
}

import type { InventoryStatus } from "@/types/inventory";

export function normalizeStatus(status: string): InventoryStatus {
  const s = status.toLowerCase().replace(/\s+/g, "_");
  if (s.includes("low")) return "low_stock";
  if (s.includes("out")) return "out_of_stock";
  return "in_stock";
}

export function statusLabel(status: string): string {
  const n = normalizeStatus(status);
  if (n === "low_stock") return "Low Stock";
  if (n === "out_of_stock") return "Out of Stock";
  return "In Stock";
}

export function statusFromQuantity(qty: number): InventoryStatus {
  if (qty <= 0) return "out_of_stock";
  if (qty <= 5) return "low_stock";
  return "in_stock";
}

export function statusBadgeClass(status: string): string {
  const n = normalizeStatus(status);
  if (n === "low_stock")
    return "bg-amber-500/15 text-amber-300 border-amber-500/30";
  if (n === "out_of_stock")
    return "bg-rose-500/15 text-rose-300 border-rose-500/30";
  return "bg-cyan-500/15 text-cyan-300 border-cyan-500/30";
}

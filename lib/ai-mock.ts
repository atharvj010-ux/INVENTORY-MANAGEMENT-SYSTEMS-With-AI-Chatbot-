import type { InventoryItem } from "@/types/inventory";
import { normalizeStatus } from "@/utils/status";

export interface ShortagePrediction {
  item: string;
  daysUntilStockout: number;
  confidence: number;
}

export interface RestockSuggestion {
  item: string;
  suggestedQty: number;
  reason: string;
}

export function predictShortages(items: InventoryItem[]): ShortagePrediction[] {
  return items
    .filter((i) => i.quantity <= 8)
    .sort((a, b) => a.quantity - b.quantity)
    .slice(0, 6)
    .map((i) => ({
      item: i.itemName,
      daysUntilStockout: Math.max(1, Math.ceil(i.quantity * 1.2)),
      confidence: Math.min(0.95, 0.65 + (8 - i.quantity) * 0.04),
    }));
}

export function restockSuggestions(items: InventoryItem[]): RestockSuggestion[] {
  return items
    .filter((i) => normalizeStatus(String(i.status)) !== "in_stock" || i.quantity <= 10)
    .slice(0, 5)
    .map((i) => ({
      item: i.itemName,
      suggestedQty: Math.max(20, 30 - i.quantity),
      reason:
        i.quantity <= 0
          ? "Out of stock — urgent reorder"
          : i.quantity <= 5
            ? "Critical low stock threshold"
            : "Below optimal buffer level",
    }));
}

export function inventoryHealthScore(items: InventoryItem[]): number {
  if (!items.length) return 100;
  const penalties = items.reduce((sum, i) => {
    const s = normalizeStatus(String(i.status));
    if (s === "out_of_stock") return sum + 3;
    if (s === "low_stock") return sum + 1.5;
    if (i.quantity <= 10) return sum + 0.5;
    return sum;
  }, 0);
  return Math.max(0, Math.round(100 - (penalties / items.length) * 12));
}

export function aiPredictionCount(items: InventoryItem[]): number {
  return predictShortages(items).length;
}

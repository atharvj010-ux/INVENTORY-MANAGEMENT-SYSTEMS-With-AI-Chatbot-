import type { InventoryItem } from "@/types/inventory";
import type { AppNotification } from "@/types/notification";
import { normalizeStatus } from "@/utils/status";

export function buildInventoryNotifications(items: InventoryItem[]): AppNotification[] {
  const now = new Date().toISOString();
  const notifications: AppNotification[] = [];

  const outOfStock = items.filter((i) => normalizeStatus(String(i.status)) === "out_of_stock");
  const lowStock = items.filter((i) => normalizeStatus(String(i.status)) === "low_stock");

  for (const item of outOfStock.slice(0, 5)) {
    notifications.push({
      id: `out-${item.id}`,
      type: "out_of_stock",
      title: "Out of stock",
      message: `${item.itemName} has 0 units — reorder urgently.`,
      href: "/dashboard/inventory",
      createdAt: item.createdAt || now,
    });
  }

  for (const item of lowStock.slice(0, 5)) {
    notifications.push({
      id: `low-${item.id}`,
      type: "low_stock",
      title: "Low stock alert",
      message: `${item.itemName} is down to ${item.quantity} units.`,
      href: "/dashboard/inventory",
      createdAt: item.createdAt || now,
    });
  }

  if (items.length > 0 && outOfStock.length + lowStock.length > 0) {
    notifications.push({
      id: "ai-insights",
      type: "info",
      title: "AI restock suggestions ready",
      message: `${outOfStock.length + lowStock.length} SKUs need attention. Review AI Insights for recommendations.`,
      href: "/dashboard/ai-insights",
      createdAt: now,
    });
  } else if (items.length > 0) {
    notifications.push({
      id: "healthy",
      type: "info",
      title: "Inventory health looks good",
      message: "All tracked items are above low-stock thresholds.",
      href: "/dashboard",
      createdAt: now,
    });
  }

  return notifications.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function readStorageKey(userId: string) {
  return `nexus-notifications-read-${userId}`;
}

export function loadReadIds(userId: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(readStorageKey(userId));
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

export function saveReadIds(userId: string, ids: Set<string>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(readStorageKey(userId), JSON.stringify([...ids]));
}

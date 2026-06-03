"use client";

import { useEffect, useState } from "react";
import { subscribeInventory } from "@/firebase/inventory";
import type { InventoryItem } from "@/types/inventory";
import { normalizeStatus } from "@/utils/status";

export function useInventory(userId: string | undefined) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setItems([]);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    const unsub = subscribeInventory(
      userId,
      (data) => {
        setItems(data);
        setLoading(false);
        setError(null);
      },
      (message) => {
        setItems([]);
        setLoading(false);
        setError(message);
      }
    );
    return unsub;
  }, [userId]);

  const stats = {
    total: items.length,
    inStock: items.filter((i) => normalizeStatus(String(i.status)) === "in_stock").length,
    lowStock: items.filter((i) => normalizeStatus(String(i.status)) === "low_stock").length,
    outOfStock: items.filter((i) => normalizeStatus(String(i.status)) === "out_of_stock").length,
    totalQty: items.reduce((s, i) => s + i.quantity, 0),
  };

  return { items, loading, error, stats };
}

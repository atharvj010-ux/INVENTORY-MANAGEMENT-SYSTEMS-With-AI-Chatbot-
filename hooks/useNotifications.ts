"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  buildInventoryNotifications,
  loadReadIds,
  saveReadIds,
} from "@/lib/notifications";
import type { InventoryItem } from "@/types/inventory";
import type { AppNotification } from "@/types/notification";

export function useNotifications(userId: string | undefined, items: InventoryItem[]) {
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  const notifications = useMemo(
    () => (userId ? buildInventoryNotifications(items) : []),
    [userId, items]
  );

  useEffect(() => {
    if (!userId) {
      setReadIds(new Set());
      setHydrated(false);
      return;
    }
    setReadIds(loadReadIds(userId));
    setHydrated(true);
  }, [userId]);

  const unreadCount = useMemo(() => {
    if (!hydrated) return 0;
    return notifications.filter((n) => !readIds.has(n.id)).length;
  }, [notifications, readIds, hydrated]);

  const markRead = useCallback(
    (id: string) => {
      if (!userId) return;
      setReadIds((prev) => {
        const next = new Set(prev);
        next.add(id);
        saveReadIds(userId, next);
        return next;
      });
    },
    [userId]
  );

  const markAllRead = useCallback(() => {
    if (!userId) return;
    const next = new Set(notifications.map((n) => n.id));
    setReadIds(next);
    saveReadIds(userId, next);
  }, [userId, notifications]);

  const isRead = useCallback((n: AppNotification) => readIds.has(n.id), [readIds]);

  return { notifications, unreadCount, markRead, markAllRead, isRead, hydrated };
}

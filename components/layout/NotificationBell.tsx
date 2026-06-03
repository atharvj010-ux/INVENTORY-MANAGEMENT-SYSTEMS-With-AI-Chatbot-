"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Bell,
  CheckCheck,
  Info,
  PackageX,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { useInventory } from "@/hooks/useInventory";
import { useNotifications } from "@/hooks/useNotifications";
import type { AppNotification, NotificationType } from "@/types/notification";

const ICONS: Record<NotificationType, typeof Bell> = {
  low_stock: AlertTriangle,
  out_of_stock: PackageX,
  info: Info,
};

const ICON_COLORS: Record<NotificationType, string> = {
  low_stock: "text-amber-400 bg-amber-500/15",
  out_of_stock: "text-rose-400 bg-rose-500/15",
  info: "text-accent-cyan bg-accent-cyan/15",
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function NotificationBell() {
  const { user } = useAuthContext();
  const { items } = useInventory(user?.uid);
  const { notifications, unreadCount, markRead, markAllRead, isRead, hydrated } =
    useNotifications(user?.uid, items);

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [panelPos, setPanelPos] = useState({ top: 56, right: 12 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useLayoutEffect(() => {
    if (!open || !ref.current) return;
    function updatePosition() {
      const rect = ref.current!.getBoundingClientRect();
      setPanelPos({
        top: rect.bottom + 8,
        right: Math.max(12, window.innerWidth - rect.right),
      });
    }
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  function handleNotificationClick(n: AppNotification) {
    markRead(n.id);
    setOpen(false);
  }

  const panel =
    open && mounted ? (
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.98 }}
        transition={{ duration: 0.15 }}
        className="fixed z-[250] w-[min(92vw,380px)] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-mid)] shadow-[0_12px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
        style={{ top: panelPos.top, right: panelPos.right }}
      >
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-[var(--color-text)]">Notifications</p>
            <p className="text-xs text-zinc-500">
              {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 ? (
              <button
                type="button"
                onClick={markAllRead}
                className="rounded-lg p-2 text-zinc-500 transition hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
                title="Mark all as read"
              >
                <CheckCheck className="h-4 w-4" />
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"
              aria-label="Close notifications"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <ul className="max-h-[min(60vh,420px)] overflow-y-auto">
          {!notifications.length ? (
            <li className="px-4 py-10 text-center text-sm text-zinc-500">
              No notifications yet. Add inventory to get stock alerts.
            </li>
          ) : (
            notifications.map((n) => {
              const Icon = ICONS[n.type];
              const read = isRead(n);
              const content = (
                <>
                  <div
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${ICON_COLORS[n.type]}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`text-sm font-medium ${read ? "text-zinc-400" : "text-[var(--color-text)]"}`}
                      >
                        {n.title}
                      </p>
                      {!read ? (
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent-pink" />
                      ) : null}
                    </div>
                    <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">
                      {n.message}
                    </p>
                    <p className="mt-1 text-[10px] text-zinc-600">{timeAgo(n.createdAt)}</p>
                  </div>
                </>
              );

              return (
                <li key={n.id} className="border-b border-white/5 last:border-0">
                  {n.href ? (
                    <Link
                      href={n.href}
                      onClick={() => handleNotificationClick(n)}
                      className={`flex gap-3 px-4 py-3 transition hover:bg-[var(--color-surface-hover)] ${
                        read ? "opacity-75" : "bg-[var(--color-surface)]"
                      }`}
                    >
                      {content}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleNotificationClick(n)}
                      className={`flex w-full gap-3 px-4 py-3 text-left transition hover:bg-[var(--color-surface-hover)] ${
                        read ? "opacity-75" : "bg-[var(--color-surface)]"
                      }`}
                    >
                      {content}
                    </button>
                  )}
                </li>
              );
            })
          )}
        </ul>

        <div className="border-t border-[var(--color-border)] px-4 py-2.5">
          <Link
            href="/dashboard/inventory"
            onClick={() => setOpen(false)}
            className="block rounded-lg py-2 text-center text-xs font-medium text-accent-cyan transition hover:bg-accent-cyan/10"
          >
            View inventory
          </Link>
        </div>
      </motion.div>
    ) : null;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
        aria-expanded={open}
        className="relative rounded-xl p-2 text-zinc-500 transition hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)] dark:text-zinc-400"
      >
        <Bell className="h-5 w-5" />
        {hydrated && unreadCount > 0 ? (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-pink px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </button>

      {mounted ? createPortal(<AnimatePresence>{panel}</AnimatePresence>, document.body) : null}
    </div>
  );
}

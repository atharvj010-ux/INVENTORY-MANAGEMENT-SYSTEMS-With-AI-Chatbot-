"use client";

import { motion } from "framer-motion";
import { Bot, Menu } from "lucide-react";
import Link from "next/link";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { NotificationBell } from "@/components/layout/NotificationBell";

type Props = {
  onMenuClick?: () => void;
};

export function Navbar({ onMenuClick }: Props) {
  const { user } = useAuthContext();

  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="app-navbar sticky top-0 z-40 border-b px-4 py-3 backdrop-blur-xl md:px-6"
    >
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-zinc-500 hover:bg-[var(--color-surface-hover)] md:hidden dark:text-zinc-400"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/dashboard/ai-assistant"
            className="hidden items-center gap-2 rounded-xl bg-gradient-to-r from-accent-cyan/20 to-accent-purple/20 px-3 py-2 text-sm font-medium text-accent-cyan hover:opacity-90 sm:flex"
          >
            <Bot className="h-4 w-4" />
            AI Assistant
          </Link>
          <NotificationBell />
          <div className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-purple to-accent-pink text-xs font-bold !text-white">
              {(user?.displayName || user?.email || "U")[0]?.toUpperCase()}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-xs font-medium leading-none">
                {user?.displayName || "User"}
              </p>
              <p className="mt-0.5 max-w-[140px] truncate text-[10px] text-zinc-500">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

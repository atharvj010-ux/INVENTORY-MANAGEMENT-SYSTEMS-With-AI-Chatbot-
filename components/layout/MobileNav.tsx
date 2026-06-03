"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  MessageSquare,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logOut } from "@/firebase/auth";
import toast from "react-hot-toast";

const links = [
  { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/dashboard/inventory", label: "Inventory", Icon: Package },
  { href: "/dashboard/analytics", label: "Analytics", Icon: BarChart3 },
  { href: "/dashboard/ai-insights", label: "AI Insights", Icon: Sparkles },
  { href: "/dashboard/ai-assistant", label: "AI Assistant", Icon: MessageSquare },
  { href: "/dashboard/settings", label: "Settings", Icon: Settings },
];

type Props = { open: boolean; onClose: () => void };

export function MobileNav({ open, onClose }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await logOut();
    toast.success("Signed out");
    onClose();
    router.push("/login");
  }

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 md:hidden"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="fixed left-0 top-0 z-50 flex h-full w-72 flex-col border-r app-sidebar md:hidden"
          >
            <div className="flex items-center justify-between border-b border-[var(--color-border)] p-4">
              <span className="font-semibold text-[var(--color-text)]">Nexus AI</span>
              <button type="button" onClick={onClose} className="p-2">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 p-3">
              {links.map(({ href, label, Icon }) => {
                const active = pathname === href || pathname.startsWith(href + "/");
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={onClose}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${
                      active
                        ? "bg-[var(--color-surface-hover)] font-medium text-[var(--color-text)]"
                        : "text-zinc-500 dark:text-zinc-400"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {label}
                  </Link>
                );
              })}
            </nav>
            <button
              type="button"
              onClick={handleLogout}
              className="m-3 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-rose-300"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}

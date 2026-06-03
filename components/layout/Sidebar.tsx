"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  ChevronLeft,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  MessageSquare,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { logOut } from "@/firebase/auth";
import toast from "react-hot-toast";

const icons = {
  LayoutDashboard,
  Package,
  BarChart3,
  Sparkles,
  MessageSquare,
  Settings,
};

const links = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" as const },
  { href: "/dashboard/inventory", label: "Inventory", icon: "Package" as const },
  { href: "/dashboard/analytics", label: "Analytics", icon: "BarChart3" as const },
  { href: "/dashboard/ai-insights", label: "AI Insights", icon: "Sparkles" as const },
  { href: "/dashboard/ai-assistant", label: "AI Assistant", icon: "MessageSquare" as const },
  { href: "/dashboard/settings", label: "Settings", icon: "Settings" as const },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  async function handleLogout() {
    try {
      await logOut();
      toast.success("Signed out");
      router.push("/login");
    } catch {
      toast.error("Failed to sign out");
    }
  }

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      className="app-sidebar relative hidden h-screen flex-shrink-0 border-r backdrop-blur-xl md:flex md:flex-col"
    >
      <div className="flex items-center gap-2 border-b border-[var(--color-border)] p-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-cyan to-accent-purple">
          <Zap className="h-5 w-5 text-white" />
        </div>
        {!collapsed ? (
          <span className="font-semibold tracking-tight text-[var(--color-text)]">Nexus AI</span>
        ) : null}
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {links.map((link) => {
          const Icon = icons[link.icon];
          const active =
            pathname === link.href ||
            (link.href !== "/dashboard" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                active
                  ? "bg-gradient-to-r from-accent-cyan/15 to-accent-purple/10 font-medium text-[var(--color-text)] glow-border"
                  : "text-zinc-500 hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)] dark:text-zinc-400"
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? "text-accent-cyan" : ""}`} />
              {!collapsed ? <span>{link.label}</span> : null}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-[var(--color-border)] p-3">
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-500 hover:bg-[var(--color-surface-hover)] dark:text-zinc-400"
        >
          <ChevronLeft
            className={`h-5 w-5 transition ${collapsed ? "rotate-180" : ""}`}
          />
          {!collapsed ? <span>Collapse</span> : null}
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-rose-300/90 hover:bg-rose-500/10"
        >
          <LogOut className="h-5 w-5" />
          {!collapsed ? <span>Logout</span> : null}
        </button>
      </div>
    </motion.aside>
  );
}

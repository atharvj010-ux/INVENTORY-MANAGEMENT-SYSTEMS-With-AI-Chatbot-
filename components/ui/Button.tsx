"use client";

import { motion } from "framer-motion";
import * as React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger" | "gradient";
  loading?: boolean;
  fullWidth?: boolean;
};

export function Button({
  className = "",
  variant = "primary",
  loading,
  fullWidth,
  children,
  disabled,
  ...props
}: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-accent-cyan/40 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "glass neon hover:bg-accent-cyan/10 text-[var(--color-text)]",
    gradient:
      "bg-gradient-to-r from-accent-cyan/90 via-accent-purple to-accent-pink !text-white shadow-glow hover:opacity-95 border-0",
    ghost:
      "border border-[var(--color-border)] bg-transparent text-zinc-600 hover:bg-[var(--color-surface-hover)] dark:text-zinc-300",
    danger:
      "bg-rose-500/10 text-rose-600 border border-rose-500/25 hover:bg-rose-500/15 dark:text-rose-200",
  };

  return (
    <motion.div
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={fullWidth ? "flex w-full" : "inline-flex"}
    >
      <button
        className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        ) : null}
        {children}
      </button>
    </motion.div>
  );
}

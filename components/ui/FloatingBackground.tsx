"use client";

import { motion } from "framer-motion";

/** Animated orbs — dark theme only. Light theme uses CSS gradients on .dashboard-main */
export function FloatingBackground() {
  return (
    <div className="floating-bg pointer-events-none fixed inset-0 z-0 hidden overflow-hidden dark:block">
      <motion.div
        className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-accent-cyan/10 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-accent-purple/15 blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-accent-pink/10 blur-3xl"
        animate={{ x: [0, 25, 0], y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

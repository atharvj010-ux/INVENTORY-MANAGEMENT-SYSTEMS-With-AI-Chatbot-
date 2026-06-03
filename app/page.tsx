"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Package,
  Play,
  Shield,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { Button } from "@/components/ui/Button";
import { FloatingBackground } from "@/components/ui/FloatingBackground";

const features = [
  {
    icon: Bot,
    title: "AI Predictions",
    desc: "Forecast shortages and optimize restock before stockouts hit.",
  },
  {
    icon: Package,
    title: "Real-time Inventory",
    desc: "Firestore-powered live sync across your entire catalog.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    desc: "Trends, category breakdowns, and revenue simulations.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    desc: "Firebase Auth with user-scoped data isolation.",
  },
];

const stats = [
  { label: "Items Tracked", value: "2.4M+" },
  { label: "AI Predictions", value: "98.2%" },
  { label: "Uptime", value: "99.9%" },
  { label: "Teams", value: "12K+" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = { hidden: { y: 16 }, show: { y: 0 } };

export default function LandingPage() {
  return (
    <div className="relative isolate min-h-screen overflow-hidden">
      <FloatingBackground />
      <LandingNavbar />

      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-24 pt-32 md:px-6 md:pt-40">
        <motion.div
          initial={false}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-accent-cyan/30 bg-accent-cyan/10 px-4 py-1.5 text-sm text-accent-cyan">
            <Sparkles className="h-4 w-4" />
            Powered by AI Intelligence
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            <span className="text-gradient">Next Generation</span>
            <br />
            AI Inventory Intelligence
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
            A futuristic inventory command center — glass UI, real-time data,
            predictive analytics, and enterprise-grade control in one dashboard.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/signup">
              <Button variant="gradient" className="px-8 py-3 text-base">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" className="px-8 py-3 text-base gap-2">
                <Play className="h-4 w-4" />
                Live Demo
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          id="preview"
          initial={false}
          className="relative mx-auto mt-20 max-w-5xl"
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-accent-cyan/20 via-accent-purple/20 to-accent-pink/20 blur-3xl" />
          <div className="glass relative overflow-hidden rounded-2xl border border-white/10 p-2 neon">
            <div className="rounded-xl bg-bg-mid p-6">
              <div className="mb-4 flex gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-400/80" />
                <span className="h-3 w-3 rounded-full bg-amber-400/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
              </div>
              <div className="grid gap-3 sm:grid-cols-4">
                {["Total", "In Stock", "Low", "AI Score"].map((l, i) => (
                  <div key={l} className="glass rounded-xl p-4">
                    <p className="text-xs text-zinc-500">{l}</p>
                    <p className="mt-1 text-2xl font-bold text-gradient">
                      {[1248, 982, 186, 94][i]}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 h-32 rounded-xl bg-gradient-to-t from-accent-purple/10 to-transparent" />
            </div>
          </div>
        </motion.div>
      </section>

      <section id="features" className="relative z-10 mx-auto max-w-7xl px-4 py-24 md:px-6">
        <h2 className="text-center text-3xl font-bold md:text-4xl">
          Built for <span className="text-gradient">modern teams</span>
        </h2>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={item}
              whileHover={{ y: -4, scale: 1.02 }}
              className="glass group p-6 transition hover:glow-border"
            >
              <f.icon className="h-8 w-8 text-accent-cyan group-hover:text-accent-purple transition" />
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-zinc-500">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section id="stats" className="relative z-10 border-y border-white/10 bg-bg-mid/50 py-20">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 md:grid-cols-4 md:px-6"
        >
          {stats.map((s) => (
            <motion.div key={s.label} variants={item} className="text-center">
              <p className="text-3xl font-bold text-gradient md:text-4xl">{s.value}</p>
              <p className="mt-2 text-sm text-zinc-500">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-4 py-24 text-center md:px-6">
        <div className="glass mx-auto max-w-2xl p-12 neon">
          <Zap className="mx-auto h-10 w-10 text-accent-cyan" />
          <h2 className="mt-4 text-2xl font-bold">Ready to transform inventory?</h2>
          <p className="mt-2 text-zinc-400">
            Join teams using AI-powered stock intelligence today.
          </p>
          <Link href="/signup" className="mt-6 inline-block">
            <Button variant="gradient" className="px-8">
              Start Free <TrendingUp className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 py-8 text-center text-sm text-zinc-600">
        © {new Date().getFullYear()} Nexus AI Inventory. All rights reserved.
      </footer>
    </div>
  );
}

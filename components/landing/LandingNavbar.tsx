"use client";

import { Menu, X, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function LandingNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-bg-deep/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-cyan to-accent-purple">
            <Zap className="h-5 w-5" />
          </div>
          Nexus AI
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm text-zinc-400 hover:text-white">
            Features
          </a>
          <a href="#stats" className="text-sm text-zinc-400 hover:text-white">
            Stats
          </a>
          <a href="#preview" className="text-sm text-zinc-400 hover:text-white">
            Preview
          </a>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/signup">
            <Button variant="gradient">Get Started</Button>
          </Link>
        </div>
        <button
          type="button"
          className="md:hidden"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open ? (
        <div className="border-t border-white/10 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <a href="#features" onClick={() => setOpen(false)}>
              Features
            </a>
            <Link href="/login">
              <Button variant="ghost" className="w-full">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="gradient" className="w-full">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      ) : null}
    </nav>
  );
}

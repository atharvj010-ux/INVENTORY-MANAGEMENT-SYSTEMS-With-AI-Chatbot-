"use client";

import { Search } from "lucide-react";
import { blockGrammarlyProps } from "@/lib/dom-props";

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
};

export function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}: Props) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        suppressHydrationWarning
        {...blockGrammarlyProps}
        className="theme-input py-2.5 pl-10 pr-4"
      />
    </div>
  );
}

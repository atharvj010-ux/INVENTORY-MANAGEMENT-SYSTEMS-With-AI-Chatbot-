"use client";

import * as React from "react";
import { blockGrammarlyProps } from "@/lib/dom-props";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({ label, error, className = "", id, ...props }: Props) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="space-y-1.5">
      {label ? (
        <label htmlFor={inputId} className="text-sm font-medium text-zinc-300">
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        suppressHydrationWarning
        {...blockGrammarlyProps}
        className={`theme-input ${error ? "border-rose-500/50" : ""} ${className}`}
        {...props}
      />
      {error ? <p className="text-xs text-rose-400">{error}</p> : null}
    </div>
  );
}

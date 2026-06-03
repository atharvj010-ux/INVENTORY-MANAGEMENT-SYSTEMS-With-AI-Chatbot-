"use client";

import { useRef } from "react";
import { Loader2, Paperclip } from "lucide-react";

type Props = {
  onUpload: (file: File) => void;
  isUploading: boolean;
  disabled?: boolean;
};

const ACCEPT = ".pdf,.docx,.txt";

export function ChatUploadButton({ onUpload, isUploading, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onUpload(file);
            e.target.value = "";
          }
        }}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled || isUploading}
        title="Upload PDF, DOCX, or TXT (indexed in Chroma)"
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-zinc-500 transition hover:border-accent-cyan/40 hover:text-accent-cyan disabled:opacity-40"
      >
        {isUploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Paperclip className="h-4 w-4" />
        )}
      </button>
    </>
  );
}

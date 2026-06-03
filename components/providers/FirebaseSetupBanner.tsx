"use client";

import { firebaseConfigErrorMessage } from "@/firebase/client";

export function FirebaseSetupBanner() {
  const message = firebaseConfigErrorMessage();
  if (!message) return null;

  return (
    <div
      role="alert"
      className="mx-auto mb-6 max-w-lg rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100"
    >
      <p className="font-medium text-amber-50">Firebase setup required</p>
      <p className="mt-1 text-amber-100/90">{message}</p>
      <p className="mt-2 text-xs text-amber-100/70">
        Copy <code className="rounded bg-black/20 px-1">.env.local.example</code> to{" "}
        <code className="rounded bg-black/20 px-1">.env.local</code>, paste your Web app
        config, then restart the dev server.
      </p>
    </div>
  );
}

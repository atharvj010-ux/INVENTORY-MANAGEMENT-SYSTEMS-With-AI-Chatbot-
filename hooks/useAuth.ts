"use client";

import { onAuthStateChanged, type User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "@/firebase/client";

export function useAuth() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        document.cookie = "auth=1; path=/; max-age=604800; SameSite=Lax";
      }
    });
    return unsub;
  }, []);

  return { user: user ?? null, loading: user === undefined };
}

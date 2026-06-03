"use client";

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const REQUIRED_ENV_KEYS = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
] as const;

export function getMissingFirebaseEnvKeys(): string[] {
  const missing: string[] = [];
  if (!firebaseConfig.apiKey?.trim()) {
    missing.push("NEXT_PUBLIC_FIREBASE_API_KEY");
  }
  if (!firebaseConfig.authDomain?.trim()) {
    missing.push("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN");
  }
  if (!firebaseConfig.projectId?.trim()) {
    missing.push("NEXT_PUBLIC_FIREBASE_PROJECT_ID");
  }
  if (!firebaseConfig.appId?.trim()) {
    missing.push("NEXT_PUBLIC_FIREBASE_APP_ID");
  }
  return missing;
}

export function isFirebaseConfigured(): boolean {
  return getMissingFirebaseEnvKeys().length === 0;
}

export function firebaseConfigErrorMessage(): string {
  const missing = getMissingFirebaseEnvKeys();
  if (missing.length === 0) return "";
  return (
    `Firebase is not configured. Add these to .env.local: ${missing.join(", ")}. ` +
    `Get values from Firebase Console → Project settings → Your apps → Web app, then restart npm run dev.`
  );
}

function assertFirebaseConfig() {
  const message = firebaseConfigErrorMessage();
  if (message) {
    throw new Error(message);
  }
}

let app: FirebaseApp | undefined;
let authInstance: Auth | undefined;
let dbInstance: Firestore | undefined;

function ensureFirebase() {
  assertFirebaseConfig();
  if (!app) {
    app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);
    authInstance = getAuth(app);
    dbInstance = getFirestore(app);
  }
  return { auth: authInstance!, db: dbInstance! };
}

/** Lazy proxy so importing this module does not throw during Next.js prerender/build. */
function lazyFirebaseProxy<T extends object>(pick: (ready: { auth: Auth; db: Firestore }) => T): T {
  return new Proxy({} as T, {
    get(_target, prop) {
      const ready = ensureFirebase();
      const instance = pick(ready);
      const value = Reflect.get(instance, prop, instance);
      return typeof value === "function" ? (value as (...args: unknown[]) => unknown).bind(instance) : value;
    },
  });
}

export const auth = lazyFirebaseProxy<Auth>(({ auth }) => auth);
export const db = lazyFirebaseProxy<Firestore>(({ db }) => db);

export { REQUIRED_ENV_KEYS };

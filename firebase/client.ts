"use client";

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function assertFirebaseConfig() {
  // Must read env vars statically (see firebaseConfig above). Dynamic
  // process.env[key] is not inlined in the client bundle and always looks empty.
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

  if (missing.length > 0) {
    throw new Error(
      `Firebase is not configured. Add these to .env.local: ${missing.join(", ")}. ` +
        `Get values from Firebase Console → Project settings → Your apps → Web app, then restart npm run dev.`
    );
  }
}

assertFirebaseConfig();

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

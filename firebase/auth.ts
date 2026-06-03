"use client";

import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { auth } from "./client";

function authErrorMessage(err: unknown): string {
  const code =
    err && typeof err === "object" && "code" in err
      ? String((err as { code: string }).code)
      : "";
  const messages: Record<string, string> = {
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/user-not-found": "No account found for this email.",
    "auth/missing-email": "Sign in with an email account to reset your password.",
    "auth/too-many-requests": "Too many attempts. Please try again later.",
    "auth/network-request-failed": "Network error. Check your connection and try again.",
  };
  if (messages[code]) return messages[code];
  if (err && typeof err === "object" && "message" in err) {
    return String((err as { message: string }).message).replace(/^Firebase:\s*/i, "");
  }
  return "Something went wrong. Please try again.";
}

export async function signUp(
  email: string,
  password: string,
  displayName: string
): Promise<User> {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName.trim()) {
    await updateProfile(cred.user, { displayName: displayName.trim() });
  }
  document.cookie = "auth=1; path=/; max-age=604800; SameSite=Lax";
  return cred.user;
}

export async function signIn(email: string, password: string): Promise<User> {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  document.cookie = "auth=1; path=/; max-age=604800; SameSite=Lax";
  return cred.user;
}

export async function logOut(): Promise<void> {
  await signOut(auth);
  document.cookie = "auth=; path=/; max-age=0";
}

/** Sends a Firebase password reset link to the user's email. */
export async function resetPassword(email: string): Promise<void> {
  const trimmed = email.trim();
  if (!trimmed) {
    throw new Error("No email on this account. Sign in with email/password first.");
  }
  await sendPasswordResetEmail(auth, trimmed);
}

export { authErrorMessage };

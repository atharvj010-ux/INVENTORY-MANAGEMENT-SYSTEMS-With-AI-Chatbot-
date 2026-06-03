import { NextRequest } from "next/server";

/** Require auth cookie set by Firebase login (see hooks/useAuth.ts) */
export function requireAuthCookie(req: NextRequest): boolean {
  return Boolean(req.cookies.get("auth")?.value);
}

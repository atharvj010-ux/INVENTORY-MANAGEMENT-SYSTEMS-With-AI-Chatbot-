import { NextRequest, NextResponse } from "next/server";

// Lightweight protected-route middleware.
// Redirect unauthenticated users to /login for dashboard routes.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname === "/dashboard" ||
    pathname.startsWith("/api/chat") ||
    pathname.startsWith("/api/session") ||
    pathname.startsWith("/api/history") ||
    pathname.startsWith("/api/upload");
  if (!isProtected) return NextResponse.next();

  // Firebase Auth tokens are typically stored in client; for this project
  // we rely on a client-side redirect as well.
  // Middleware just prevents anonymous access flashes.
  const hasAuthCookie = req.cookies.get("auth")?.value;
  if (hasAuthCookie) return NextResponse.next();

  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/chat",
    "/api/session",
    "/api/history",
    "/api/upload",
  ],
};


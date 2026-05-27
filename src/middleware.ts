import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if our authentication cookie signature is present
  const isAuthenticated = request.cookies.has("antigravity_session");

  // Bypass verification for the login screen, Next.js system build files, and public layout assets
  if (pathname.startsWith("/login") || pathname.startsWith("/_next") || pathname.includes(".")) {
    return NextResponse.next();
  }

  // If a user has no active cookie session, force-route them to the credential portal
  if (!isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Intercept all route variations inside the application framework
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

import { NextResponse } from "next/next";
import type { NextRequest } from "next/next";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve our secure node credential token
  const isAuthenticated = request.cookies.has("antigravity_session");

  // Bypass protection verification for public app asset pipelines or the gateway page itself
  if (pathname.startsWith("/login") || pathname.startsWith("/_next") || pathname.includes(".")) {
    return NextResponse.next();
  }

  // If unauthorized configuration tries to breach dashboard subnodes, reroute to verification page
  if (!isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Ensure the security layer matches across every master page interface completely
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;
  const url = request.nextUrl.clone();

  // Skip static files and Next internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/auth/callback")
  ) {
    return NextResponse.next();
  }

  const APP_HOST = "app.yogawritecode.com";
  const MARKETING_HOSTS = ["yogawritecode.com", "www.yogawritecode.com"];

  // App subdomain: root → dashboard
  if (hostname === APP_HOST && pathname === "/") {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Marketing domains: send auth routes to app
  if (MARKETING_HOSTS.includes(hostname)) {
    if (pathname === "/login" || pathname === "/signup" || pathname.startsWith("/dashboard")) {
      url.hostname = APP_HOST;
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)).*)"],
};
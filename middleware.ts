import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const APP_HOST = "app.yogawritecode.com";
const MARKETING_HOSTS = ["yogawritecode.com", "www.yogawritecode.com"];

export function middleware(request: NextRequest) {
  const { hostname, pathname } = request.nextUrl;
  const url = request.nextUrl.clone();

  // 1) App subdomain: root goes straight to the dashboard (same host, no cookie issues)
  if (hostname === APP_HOST && pathname === "/") {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // 2) Marketing domains: send auth + dashboard traffic to the app subdomain
  if (MARKETING_HOSTS.includes(hostname)) {
    if (
      pathname === "/login" ||
      pathname === "/signup" ||
      pathname.startsWith("/dashboard")
    ) {
      url.hostname = APP_HOST;
      return NextResponse.redirect(url);
    }
  }

  // Everything else (localhost, vercel.app previews, all app pages) passes through
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|txt|xml|woff|woff2|ttf|eot)).*)",
  ],
};
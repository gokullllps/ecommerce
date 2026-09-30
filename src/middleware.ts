import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  getSafeSessionSecret,
  verifySessionToken,
} from "@/lib/auth/adminSession";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const sessionToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const sessionSecret = getSafeSessionSecret();

  const session = await verifySessionToken(sessionToken, sessionSecret);
  const isLoginPage = pathname === "/admin/login";

  // 1. If user is authenticated and visits /admin/login, redirect to /admin dashboard
  if (session && isLoginPage) {
    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = "/admin";
    return NextResponse.redirect(adminUrl);
  }

  // 2. If user is unauthenticated and visits any protected /admin route (other than /admin/login)
  if (!session && !isLoginPage) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};

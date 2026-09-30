import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  getSafeSessionSecret,
  verifySessionToken,
} from "@/lib/auth/adminSession";
import { canRoleAccessRoute } from "@/lib/permissions";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const sessionToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const sessionSecret = getSafeSessionSecret();

  const session = await verifySessionToken(sessionToken, sessionSecret);
  const isLoginPage = pathname === "/admin/login";
  const isUnauthorizedPage = pathname === "/admin/unauthorized";

  // 1. If user is authenticated:
  if (session) {
    // 1a. If visiting /admin/login, redirect to /admin dashboard
    if (isLoginPage) {
      const adminUrl = request.nextUrl.clone();
      adminUrl.pathname = "/admin";
      return NextResponse.redirect(adminUrl);
    }

    // 1b. If visiting /admin/unauthorized, allow access
    if (isUnauthorizedPage) {
      return NextResponse.next();
    }

    // 1c. Strict RBAC: Check if admin's role has permission for this route
    const isAuthorized = canRoleAccessRoute(session.role, pathname);
    if (!isAuthorized) {
      const unauthorizedUrl = request.nextUrl.clone();
      unauthorizedUrl.pathname = "/admin/unauthorized";
      return NextResponse.redirect(unauthorizedUrl);
    }

    return NextResponse.next();
  }

  // 2. If user is unauthenticated:
  // 2a. Allow access to /admin/login
  if (isLoginPage) {
    return NextResponse.next();
  }

  // 2b. Redirect all other /admin routes to /admin/login
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};

export default proxy;
export { proxy as middleware };

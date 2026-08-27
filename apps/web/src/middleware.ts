import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { AUTH_ADMIN_LOGIN_PATH, AUTH_SESSION_COOKIE_NAME } from "@/config/auth";
import { isProtectedAdminPath, isPublicAdminPath } from "@/lib/auth/paths";

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  if (!isProtectedAdminPath(pathname) || isPublicAdminPath(pathname)) {
    return NextResponse.next();
  }

  const sessionToken = request.cookies.get(AUTH_SESSION_COOKIE_NAME)?.value;

  if (sessionToken === undefined || sessionToken.trim() === "") {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = AUTH_ADMIN_LOGIN_PATH;
    loginUrl.search = "";
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};

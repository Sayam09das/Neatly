import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { AUTH_SESSION_COOKIE_NAME } from "@/config/auth";
import { getEdgeAuthDecision } from "@/lib/auth/paths";

export function middleware(request: NextRequest): NextResponse {
  const sessionToken = request.cookies.get(AUTH_SESSION_COOKIE_NAME)?.value;
  const decision = getEdgeAuthDecision({
    hasSession: sessionToken !== undefined && sessionToken.trim() !== "",
    pathname: request.nextUrl.pathname,
  });

  if (decision.type === "next") {
    return NextResponse.next();
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = decision.pathname;
  loginUrl.search = "";

  if (decision.next !== undefined) {
    loginUrl.searchParams.set("next", decision.next);
  }

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/dashboard",
    "/dashboard/:path*",
    "/booking",
    "/booking/:path*",
    "/services/:slug/apply",
  ],
};

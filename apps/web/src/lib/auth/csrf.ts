import { loadClientEnv } from "@neatly/config";
import { AUTH_ERROR_MESSAGES, AuthError } from "@/lib/auth/errors";
import { isSameOriginRequest } from "@/lib/auth/origin";

export function assertSameOrigin(request: Request): void {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (siteUrl === undefined || siteUrl.trim() === "") {
    throw new AuthError("INTERNAL_ERROR", AUTH_ERROR_MESSAGES.INTERNAL_ERROR);
  }

  const allowedSiteUrl = loadClientEnv({
    NEXT_PUBLIC_SITE_URL: siteUrl,
  }).NEXT_PUBLIC_SITE_URL;

  if (!isSameOriginRequest(request, allowedSiteUrl)) {
    throw new AuthError("FORBIDDEN", AUTH_ERROR_MESSAGES.FORBIDDEN);
  }
}

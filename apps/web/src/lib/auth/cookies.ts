import {
  AUTH_SESSION_COOKIE_NAME,
  AUTH_SESSION_COOKIE_PATH,
  AUTH_SESSION_COOKIE_SAME_SITE,
  AUTH_SESSION_MAX_AGE_SECONDS,
} from "@/config/auth";

export interface AuthSessionCookie {
  name: typeof AUTH_SESSION_COOKIE_NAME;
  value: string;
  httpOnly: true;
  secure: boolean;
  sameSite: typeof AUTH_SESSION_COOKIE_SAME_SITE;
  path: typeof AUTH_SESSION_COOKIE_PATH;
  maxAge: number;
}

export function isProductionRuntime(
  nodeEnv: string | undefined = process.env.NODE_ENV,
): boolean {
  return nodeEnv === "production";
}

export function createSessionCookie(
  sessionToken: string,
  nodeEnv: string | undefined = process.env.NODE_ENV,
): AuthSessionCookie {
  return {
    name: AUTH_SESSION_COOKIE_NAME,
    value: sessionToken,
    httpOnly: true,
    secure: isProductionRuntime(nodeEnv),
    sameSite: AUTH_SESSION_COOKIE_SAME_SITE,
    path: AUTH_SESSION_COOKIE_PATH,
    maxAge: AUTH_SESSION_MAX_AGE_SECONDS,
  };
}

export function createClearedSessionCookie(
  nodeEnv: string | undefined = process.env.NODE_ENV,
): AuthSessionCookie {
  return {
    ...createSessionCookie("", nodeEnv),
    maxAge: 0,
  };
}

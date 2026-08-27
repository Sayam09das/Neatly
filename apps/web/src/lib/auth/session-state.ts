import type { AuthSession, AuthUser } from "@/types/auth";

export const AUTH_USER_PUBLIC_FIELDS = [
  "id",
  "name",
  "email",
  "role",
  "status",
  "lastLoginAt",
] as const;

const SENSITIVE_AUTH_FIELDS = [
  "passwordHash",
  "sessionToken",
  "tokenHash",
  "token",
] as const;

export function toAuthSession(user: AuthUser | null): AuthSession {
  if (user === null) {
    return { status: "unauthenticated", user: null };
  }

  return { status: "authenticated", user };
}

export function exposesSensitiveAuthFields(value: object): boolean {
  return SENSITIVE_AUTH_FIELDS.some((field) => field in value);
}

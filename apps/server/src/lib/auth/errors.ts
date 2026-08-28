import type { AuthErrorCode, AuthFieldIssue } from "./types.ts";

export class AuthError extends Error {
  public readonly code: AuthErrorCode;
  public readonly details: readonly AuthFieldIssue[] | undefined;

  public constructor(
    code: AuthErrorCode,
    message: string,
    details?: readonly AuthFieldIssue[],
  ) {
    super(message);
    this.name = "AuthError";
    this.code = code;
    this.details = details;
  }
}

export const AUTH_ERROR_HTTP_STATUS: Record<AuthErrorCode, number> = {
  FORBIDDEN: 403,
  INTERNAL_ERROR: 500,
  INVALID_CREDENTIALS: 401,
  INVALID_INPUT: 400,
  RATE_LIMITED: 429,
  SESSION_EXPIRED: 401,
  TOKEN_EXPIRED: 400,
  TOKEN_INVALID: 400,
  UNAUTHORIZED: 401,
};

export const AUTH_ERROR_MESSAGES = {
  FORBIDDEN: "You do not have permission to perform this action.",
  INTERNAL_ERROR: "Unable to complete this request. Please try again.",
  INVALID_CREDENTIALS: "Invalid email or password.",
  RATE_LIMITED: "Too many attempts. Try again later.",
  SESSION_EXPIRED: "Your session has expired. Please sign in again.",
  TOKEN_EXPIRED: "This link is invalid or has expired.",
  TOKEN_INVALID: "This link is invalid or has expired.",
  UNAUTHORIZED: "Authentication is required.",
} as const;

import type { AuthErrorCode, AuthFieldIssue } from "@/types/auth";

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
  INVALID_INPUT: 400,
  INVALID_CREDENTIALS: 401,
  EMAIL_UNVERIFIED: 403,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  SESSION_EXPIRED: 401,
  TOKEN_EXPIRED: 400,
  TOKEN_INVALID: 400,
  RATE_LIMITED: 429,
  INTERNAL_ERROR: 500,
};

export const AUTH_ERROR_MESSAGES = {
  EMAIL_UNVERIFIED: "Please verify your email before signing in.",
  INVALID_CREDENTIALS: "Invalid email or password.",
  UNAUTHORIZED: "Authentication is required.",
  FORBIDDEN: "You do not have permission to perform this action.",
  SESSION_EXPIRED: "Your session has expired. Please sign in again.",
  TOKEN_EXPIRED: "This reset link is invalid or has expired.",
  TOKEN_INVALID: "This reset link is invalid or has expired.",
  RATE_LIMITED: "Too many attempts. Try again later.",
  INTERNAL_ERROR: "Unable to complete this request. Please try again.",
} as const;

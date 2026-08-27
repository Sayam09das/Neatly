import type { AuthError } from "@/lib/auth/errors";
import { AUTH_ERROR_HTTP_STATUS } from "@/lib/auth/errors";
import type { AuthErrorCode, AuthFieldIssue } from "@/types/auth";

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  error: null;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  data: null;
  error: {
    code: AuthErrorCode | "INVALID_INPUT" | "INTERNAL_ERROR";
    message: string;
    details?: readonly AuthFieldIssue[];
  };
  timestamp: string;
}

function timestamp(): string {
  return new Date().toISOString();
}

export function jsonSuccess<T>(
  data: T,
  init?: { status?: number; headers?: HeadersInit },
): Response {
  const body: ApiSuccessResponse<T> = {
    success: true,
    data,
    error: null,
    timestamp: timestamp(),
  };

  return Response.json(body, {
    status: init?.status ?? 200,
    headers: {
      "Cache-Control": "no-store",
      ...init?.headers,
    },
  });
}

export function jsonError(
  error: AuthError,
  init?: { headers?: HeadersInit },
): Response {
  const body: ApiErrorResponse = {
    success: false,
    data: null,
    error: {
      code: error.code,
      message: error.message,
      ...(error.details === undefined ? {} : { details: error.details }),
    },
    timestamp: timestamp(),
  };

  return Response.json(body, {
    status: AUTH_ERROR_HTTP_STATUS[error.code],
    headers: {
      "Cache-Control": "no-store",
      ...init?.headers,
    },
  });
}

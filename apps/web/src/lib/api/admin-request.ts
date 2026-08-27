import type { AuthErrorCode } from "@/types/auth";

export interface AdminApiSuccess<T> {
  ok: true;
  status: number;
  data: T;
}

export interface AdminApiFailure {
  ok: false;
  status: number;
  code: AuthErrorCode | "INTERNAL_ERROR";
  message: string;
  unauthorized: boolean;
  forbidden: boolean;
}

export type AdminApiResult<T> = AdminApiSuccess<T> | AdminApiFailure;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readErrorCode(value: unknown): AuthErrorCode | "INTERNAL_ERROR" {
  if (
    value === "INVALID_INPUT" ||
    value === "INVALID_CREDENTIALS" ||
    value === "UNAUTHORIZED" ||
    value === "FORBIDDEN" ||
    value === "SESSION_EXPIRED" ||
    value === "TOKEN_EXPIRED" ||
    value === "TOKEN_INVALID" ||
    value === "RATE_LIMITED" ||
    value === "INTERNAL_ERROR"
  ) {
    return value;
  }

  return "INTERNAL_ERROR";
}

function readSafeMessage(value: unknown): string {
  if (typeof value !== "string" || value.trim() === "") {
    return "Unable to complete this request. Please try again.";
  }

  return value;
}

export function parseAdminApiResponse<T>(
  status: number,
  body: unknown,
): AdminApiResult<T> {
  const unauthorized = status === 401;
  const forbidden = status === 403;

  if (
    status >= 200 &&
    status < 300 &&
    isRecord(body) &&
    body.success === true &&
    "data" in body
  ) {
    return {
      ok: true,
      status,
      data: body.data as T,
    };
  }

  const error = isRecord(body) && isRecord(body.error) ? body.error : undefined;

  return {
    ok: false,
    status,
    code: unauthorized
      ? readErrorCode(error?.code) === "INTERNAL_ERROR"
        ? "UNAUTHORIZED"
        : readErrorCode(error?.code)
      : forbidden
        ? "FORBIDDEN"
        : readErrorCode(error?.code),
    message: readSafeMessage(error?.message),
    unauthorized,
    forbidden,
  };
}

export async function adminRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<AdminApiResult<T>> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");

  if (init.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(path, {
    ...init,
    credentials: "same-origin",
    cache: "no-store",
    headers,
  });

  let body: unknown = null;

  try {
    body = await response.json();
  } catch {
    body = null;
  }

  return parseAdminApiResponse<T>(response.status, body);
}

export async function requestAdminLogout(): Promise<
  AdminApiResult<{ signedOut: true }>
> {
  return adminRequest<{ signedOut: true }>("/api/admin/auth/logout", {
    method: "POST",
  });
}

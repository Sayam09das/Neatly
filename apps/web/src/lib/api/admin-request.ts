import type { AuthErrorCode } from "@/types/auth";

export interface AdminApiSuccess<T> {
  ok: true;
  status: number;
  data: T;
}

export type AdminApiErrorCode =
  | AuthErrorCode
  | "CONFLICT"
  | "INTERNAL_ERROR"
  | "NOT_FOUND";

export interface AdminApiFailure {
  ok: false;
  status: number;
  code: AdminApiErrorCode;
  fields: Record<string, string>;
  message: string;
  unauthorized: boolean;
  forbidden: boolean;
}

export type AdminApiResult<T> = AdminApiSuccess<T> | AdminApiFailure;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readErrorCode(value: unknown): AdminApiErrorCode {
  if (
    value === "INVALID_INPUT" ||
    value === "INVALID_CREDENTIALS" ||
    value === "UNAUTHORIZED" ||
    value === "FORBIDDEN" ||
    value === "SESSION_EXPIRED" ||
    value === "TOKEN_EXPIRED" ||
    value === "TOKEN_INVALID" ||
    value === "RATE_LIMITED" ||
    value === "NOT_FOUND" ||
    value === "CONFLICT" ||
    value === "INTERNAL_ERROR"
  ) {
    return value;
  }

  return "INTERNAL_ERROR";
}

function fallbackErrorCode(status: number): AdminApiErrorCode {
  if (status === 404) {
    return "NOT_FOUND";
  }

  if (status === 409) {
    return "CONFLICT";
  }

  if (status === 429) {
    return "RATE_LIMITED";
  }

  if (status === 400 || status === 422) {
    return "INVALID_INPUT";
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

  if (status === 204) {
    return {
      ok: true,
      status,
      data: undefined as T,
    };
  }

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
  const parsedCode = readErrorCode(error?.code);

  return {
    ok: false,
    status,
    code: unauthorized
      ? parsedCode === "INTERNAL_ERROR"
        ? "UNAUTHORIZED"
        : parsedCode
      : forbidden
        ? "FORBIDDEN"
        : parsedCode === "INTERNAL_ERROR"
          ? fallbackErrorCode(status)
          : parsedCode,
    fields: readErrorFields(error),
    message: readSafeMessage(error?.message),
    unauthorized,
    forbidden,
  };
}

function readErrorFields(
  error: Record<string, unknown> | undefined,
): Record<string, string> {
  if (error === undefined) {
    return {};
  }

  const fields = error.fields;
  const mapped: Record<string, string> = {};

  if (isRecord(fields)) {
    for (const [key, value] of Object.entries(fields)) {
      if (typeof value === "string" && value.trim() !== "") {
        mapped[key] = value;
      }
    }
  }

  return mapped;
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

import type { AuthErrorCode } from "@/types/auth";

export type JsonApiErrorCode =
  | AuthErrorCode
  | "CONFLICT"
  | "INTERNAL_ERROR"
  | "NOT_FOUND";

export interface JsonApiSuccess<T> {
  ok: true;
  status: number;
  data: T;
}

export interface JsonApiFailure {
  ok: false;
  status: number;
  code: JsonApiErrorCode;
  fields: Record<string, string>;
  message: string;
  unauthorized: boolean;
  forbidden: boolean;
}

export type JsonApiResult<T> = JsonApiSuccess<T> | JsonApiFailure;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readErrorCode(value: unknown): JsonApiErrorCode {
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

function fallbackErrorCode(status: number): JsonApiErrorCode {
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

export function parseJsonApiResponse<T>(
  status: number,
  body: unknown,
): JsonApiResult<T> {
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

export async function sameOriginJsonRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<JsonApiResult<T>> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");

  if (
    init.body !== undefined &&
    !headers.has("Content-Type") &&
    !(init.body instanceof FormData)
  ) {
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

  return parseJsonApiResponse<T>(response.status, body);
}

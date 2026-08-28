export const API_SERVICE_NAME = "neatly-api";
export const API_DEFAULT_PORT = 4000;
export const API_DEFAULT_HOST = "0.0.0.0";
export const API_SHUTDOWN_TIMEOUT_MS = 10_000;

export const API_ERROR_CODES = {
  INTERNAL_ERROR: "INTERNAL_ERROR",
  METHOD_NOT_ALLOWED: "METHOD_NOT_ALLOWED",
  NOT_FOUND: "NOT_FOUND",
} as const;

export type ApiErrorCode =
  (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES];

export const HTTP_STATUS = {
  INTERNAL_SERVER_ERROR: 500,
  METHOD_NOT_ALLOWED: 405,
  NOT_FOUND: 404,
  OK: 200,
} as const;

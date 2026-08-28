import {
  API_ERROR_CODES,
  type ApiErrorCode,
  HTTP_STATUS,
} from "../config/constants.ts";

export class AppError extends Error {
  public readonly code: ApiErrorCode;
  public readonly details:
    | readonly { field: string; issue: string }[]
    | undefined;
  public readonly expose: boolean;
  public readonly statusCode: number;

  public constructor(
    code: ApiErrorCode,
    message: string,
    statusCode: number,
    expose = true,
    details?: readonly { field: string; issue: string }[],
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.expose = expose;
    this.details = details;
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function toAppError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }

  return new AppError(
    API_ERROR_CODES.INTERNAL_ERROR,
    unknownErrorMessage(error),
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    false,
  );
}

function unknownErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim() !== "") {
    return error.message;
  }

  return "An unexpected error occurred.";
}

export function createNotFoundError(): AppError {
  return new AppError(
    API_ERROR_CODES.NOT_FOUND,
    "The requested resource was not found.",
    HTTP_STATUS.NOT_FOUND,
  );
}

export function createMethodNotAllowedError(): AppError {
  return new AppError(
    API_ERROR_CODES.METHOD_NOT_ALLOWED,
    "This method is not allowed for the requested resource.",
    HTTP_STATUS.METHOD_NOT_ALLOWED,
  );
}

export function createDatabaseUnavailableError(): AppError {
  return new AppError(
    API_ERROR_CODES.DATABASE_UNAVAILABLE,
    "The database is unavailable.",
    HTTP_STATUS.SERVICE_UNAVAILABLE,
  );
}

import {
  API_ERROR_CODES,
  type ApiErrorCode,
  HTTP_STATUS,
} from "../config/constants.ts";

export interface ApiFieldIssue {
  field: string;
  issue: string;
}

export class AppError extends Error {
  public readonly code: ApiErrorCode;
  public readonly details: readonly ApiFieldIssue[] | undefined;
  public readonly expose: boolean;
  public readonly statusCode: number;

  public constructor(
    code: ApiErrorCode,
    message: string,
    statusCode: number,
    expose = true,
    details?: readonly ApiFieldIssue[],
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.expose = expose;
    this.details = details;
  }
}

export class ValidationError extends AppError {
  public constructor(message: string, details?: readonly ApiFieldIssue[]) {
    super(
      API_ERROR_CODES.INVALID_INPUT,
      message,
      HTTP_STATUS.BAD_REQUEST,
      true,
      details,
    );
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends AppError {
  public constructor(
    message = "Authentication is required.",
    code: ApiErrorCode = API_ERROR_CODES.UNAUTHORIZED,
  ) {
    super(code, message, HTTP_STATUS.UNAUTHORIZED);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends AppError {
  public constructor(
    message = "You do not have permission to perform this action.",
  ) {
    super(API_ERROR_CODES.FORBIDDEN, message, HTTP_STATUS.FORBIDDEN);
    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends AppError {
  public constructor(message = "The requested resource was not found.") {
    super(API_ERROR_CODES.NOT_FOUND, message, HTTP_STATUS.NOT_FOUND);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends AppError {
  public constructor(message = "The request conflicts with existing data.") {
    super(API_ERROR_CODES.CONFLICT, message, HTTP_STATUS.CONFLICT);
    this.name = "ConflictError";
  }
}

export class RateLimitError extends AppError {
  public constructor(message = "Too many attempts. Try again later.") {
    super(API_ERROR_CODES.RATE_LIMITED, message, HTTP_STATUS.TOO_MANY_REQUESTS);
    this.name = "RateLimitError";
  }
}

export class InternalServerError extends AppError {
  public constructor(message = "An unexpected error occurred.") {
    super(
      API_ERROR_CODES.INTERNAL_ERROR,
      message,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      false,
    );
    this.name = "InternalServerError";
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function toAppError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }

  return new InternalServerError(unknownErrorMessage(error));
}

function unknownErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim() !== "") {
    return error.message;
  }

  return "An unexpected error occurred.";
}

export function createRouteNotFoundError(): AppError {
  return new AppError(
    API_ERROR_CODES.ROUTE_NOT_FOUND,
    "The requested route was not found.",
    HTTP_STATUS.NOT_FOUND,
  );
}

export function createNotFoundError(): AppError {
  return new NotFoundError();
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

export function createUnsupportedMediaTypeError(): AppError {
  return new AppError(
    API_ERROR_CODES.UNSUPPORTED_MEDIA_TYPE,
    "Request must use application/json.",
    HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE,
  );
}

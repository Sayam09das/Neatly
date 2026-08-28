import { API_ERROR_CODES, type ApiErrorCode } from "../../config/constants.ts";
import { AppError } from "../errors.ts";
import { AUTH_ERROR_HTTP_STATUS, type AuthError } from "./errors.ts";

export function toAppErrorFromAuth(error: AuthError): AppError {
  const statusCode = AUTH_ERROR_HTTP_STATUS[error.code];
  const code = isApiErrorCode(error.code)
    ? error.code
    : API_ERROR_CODES.INTERNAL_ERROR;

  return new AppError(code, error.message, statusCode, true, error.details);
}

function isApiErrorCode(code: string): code is ApiErrorCode {
  return Object.values(API_ERROR_CODES).includes(code as ApiErrorCode);
}

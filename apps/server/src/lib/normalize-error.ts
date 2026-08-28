import { AuthError } from "./auth/errors.ts";
import { toAppErrorFromAuth } from "./auth/http-error.ts";
import { type AppError, isAppError, toAppError } from "./errors.ts";
import { mapPrismaError } from "./prisma-error.ts";

export function normalizeError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof AuthError) {
    return toAppErrorFromAuth(error);
  }

  const prismaError = mapPrismaError(error);

  if (prismaError !== null) {
    return prismaError;
  }

  return toAppError(error);
}

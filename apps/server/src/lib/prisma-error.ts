import { Prisma } from "@prisma/client";
import { ConflictError, InternalServerError, NotFoundError } from "./errors.ts";

export { Prisma };

const UNIQUE_CONSTRAINT_CODE = "P2002";
const FOREIGN_KEY_CODE = "P2003";
const RECORD_NOT_FOUND_CODE = "P2025";

export function mapPrismaError(
  error: unknown,
): ConflictError | InternalServerError | NotFoundError | null {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (
      error.code === UNIQUE_CONSTRAINT_CODE ||
      error.code === FOREIGN_KEY_CODE
    ) {
      return new ConflictError();
    }

    if (error.code === RECORD_NOT_FOUND_CODE) {
      return new NotFoundError();
    }

    return new InternalServerError();
  }

  if (
    error instanceof Prisma.PrismaClientValidationError ||
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientRustPanicError ||
    error instanceof Prisma.PrismaClientUnknownRequestError
  ) {
    return new InternalServerError();
  }

  return null;
}

export function getPrismaErrorCode(error: unknown): string | undefined {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return error.code;
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return "VALIDATION";
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return "INITIALIZATION";
  }

  if (error instanceof Prisma.PrismaClientRustPanicError) {
    return "PANIC";
  }

  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    return "UNKNOWN";
  }

  return undefined;
}

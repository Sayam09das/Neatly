import type { IncomingMessage, ServerResponse } from "node:http";
import { API_ERROR_CODES } from "../config/constants.ts";
import type { ApiNodeEnv } from "../config/env.ts";
import { ValidationError } from "../lib/errors.ts";
import { sendFailure } from "../lib/http.ts";
import { logError, logInfo } from "../lib/logger.ts";
import { normalizeError } from "../lib/normalize-error.ts";
import { getPrismaErrorCode } from "../lib/prisma-error.ts";
import { tryGetRequestContext } from "../lib/request-context.ts";

const CLIENT_ERROR_MAX_STATUS = 499;

export function handleRequestError(
  error: unknown,
  req: IncomingMessage,
  res: ServerResponse,
  nodeEnv: ApiNodeEnv,
): void {
  const context = tryGetRequestContext(req);
  const requestId = context?.requestId;
  const path = context?.path ?? "/";
  const method = context?.method ?? req.method ?? "GET";
  const mapped = normalizeError(error);

  if (mapped instanceof ValidationError) {
    if (nodeEnv !== "test") {
      logInfo("Request validation failed", {
        code: mapped.code,
        method,
        path,
        requestId,
      });
    }
    sendFailure(res, mapped, nodeEnv, requestId);
    return;
  }

  if (mapped.statusCode > CLIENT_ERROR_MAX_STATUS && nodeEnv !== "test") {
    const prismaCode = getPrismaErrorCode(error);

    logError("Unhandled request error", {
      code: prismaCode ?? mapped.code ?? API_ERROR_CODES.INTERNAL_ERROR,
      method,
      path,
      requestId,
    });
  }

  sendFailure(res, mapped, nodeEnv, requestId);
}

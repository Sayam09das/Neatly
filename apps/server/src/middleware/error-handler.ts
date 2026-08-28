import type { IncomingMessage, ServerResponse } from "node:http";
import { API_ERROR_CODES } from "../config/constants.ts";
import type { ApiNodeEnv } from "../config/env.ts";
import { isAppError } from "../lib/errors.ts";
import { sendFailure, sendUnknownError } from "../lib/http.ts";
import { logError } from "../lib/logger.ts";
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

  if (isAppError(error) && error.statusCode <= CLIENT_ERROR_MAX_STATUS) {
    sendFailure(res, error, nodeEnv, requestId);
    return;
  }

  const path = context?.path ?? "/";
  const method = context?.method ?? req.method ?? "GET";
  const code = isAppError(error) ? error.code : API_ERROR_CODES.INTERNAL_ERROR;

  logError("Unhandled request error", {
    code,
    method,
    path,
    requestId,
  });

  sendUnknownError(res, error, nodeEnv, requestId);
}

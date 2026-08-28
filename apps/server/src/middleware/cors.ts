import type { IncomingMessage, ServerResponse } from "node:http";
import { HTTP_STATUS } from "../config/constants.ts";
import type { ApiEnv } from "../config/env.ts";
import { AuthorizationError } from "../lib/errors.ts";
import { getHeader } from "../lib/request.ts";

const ALLOWED_HEADERS =
  "content-type, authorization, x-session-token, x-request-id, x-forwarded-for";
const ALLOWED_METHODS = "GET, POST, PATCH, PUT, DELETE, OPTIONS";

export function applyCors(
  req: IncomingMessage,
  res: ServerResponse,
  env: ApiEnv,
): boolean {
  const origin = getHeader(req, "origin");

  if (origin === undefined || env.corsOrigin === null) {
    return false;
  }

  if (origin !== env.corsOrigin) {
    throw new AuthorizationError("Origin is not allowed.");
  }

  res.setHeader("access-control-allow-origin", origin);
  res.setHeader("access-control-allow-credentials", "true");
  res.setHeader("access-control-allow-headers", ALLOWED_HEADERS);
  res.setHeader("access-control-allow-methods", ALLOWED_METHODS);
  res.setHeader("access-control-max-age", "600");
  res.setHeader("vary", "Origin");

  if (req.method?.toUpperCase() === "OPTIONS") {
    res.statusCode = HTTP_STATUS.NO_CONTENT;
    res.end();
    return true;
  }

  return false;
}

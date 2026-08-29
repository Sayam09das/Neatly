import type { IncomingMessage, ServerResponse } from "node:http";
import {
  ADMIN_MUTATION_RATE_LIMIT_MAX,
  ADMIN_MUTATION_RATE_LIMIT_WINDOW_MS,
  ADMIN_SSE_RATE_LIMIT_MAX,
  ADMIN_SSE_RATE_LIMIT_WINDOW_MS,
} from "../config/constants.ts";
import { loadApiEnv } from "../config/env.ts";
import { MemoryRateLimiter } from "../lib/auth/rate-limit.ts";
import { RateLimitError } from "../lib/errors.ts";
import type { RequestContext } from "../lib/request-context.ts";

const mutationLimiter = new MemoryRateLimiter(
  ADMIN_MUTATION_RATE_LIMIT_MAX,
  ADMIN_MUTATION_RATE_LIMIT_WINDOW_MS,
);

const streamLimiter = new MemoryRateLimiter(
  ADMIN_SSE_RATE_LIMIT_MAX,
  ADMIN_SSE_RATE_LIMIT_WINDOW_MS,
);

export function limitAdminStreams(
  _req: IncomingMessage,
  _res: ServerResponse,
  context: RequestContext,
): void {
  if (loadApiEnv().nodeEnv === "test") {
    return;
  }

  const key = `sse:${context.user?.id ?? context.ip}`;

  if (!streamLimiter.consume(key)) {
    throw new RateLimitError();
  }
}

export function limitAdminMutations(
  req: IncomingMessage,
  _res: ServerResponse,
  context: RequestContext,
): void {
  if (loadApiEnv().nodeEnv === "test") {
    return;
  }

  const key = `${context.user?.id ?? context.ip}:${req.method}:${context.path}`;

  if (!mutationLimiter.consume(key)) {
    throw new RateLimitError();
  }
}

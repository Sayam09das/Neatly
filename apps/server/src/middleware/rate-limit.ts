import type { IncomingMessage, ServerResponse } from "node:http";
import {
  AUTH_RATE_LIMIT_MAX_ATTEMPTS,
  AUTH_RATE_LIMIT_WINDOW_MS,
} from "../config/auth.ts";
import {
  CUSTOMER_MUTATION_RATE_LIMIT_MAX,
  CUSTOMER_MUTATION_RATE_LIMIT_WINDOW_MS,
} from "../config/bookings.ts";
import {
  ADMIN_MUTATION_RATE_LIMIT_MAX,
  ADMIN_MUTATION_RATE_LIMIT_WINDOW_MS,
  ADMIN_SSE_RATE_LIMIT_MAX,
  ADMIN_SSE_RATE_LIMIT_WINDOW_MS,
  PUBLIC_NEWSLETTER_RATE_LIMIT_MAX,
  PUBLIC_NEWSLETTER_RATE_LIMIT_WINDOW_MS,
} from "../config/constants.ts";
import { loadApiEnv } from "../config/env.ts";
import {
  QUOTE_RATE_LIMIT_MAX,
  QUOTE_RATE_LIMIT_WINDOW_MS,
} from "../config/quotes.ts";
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

const customerMutationLimiter = new MemoryRateLimiter(
  CUSTOMER_MUTATION_RATE_LIMIT_MAX,
  CUSTOMER_MUTATION_RATE_LIMIT_WINDOW_MS,
);

const quoteLimiter = new MemoryRateLimiter(
  QUOTE_RATE_LIMIT_MAX,
  QUOTE_RATE_LIMIT_WINDOW_MS,
);

const newsletterLimiter = new MemoryRateLimiter(
  PUBLIC_NEWSLETTER_RATE_LIMIT_MAX,
  PUBLIC_NEWSLETTER_RATE_LIMIT_WINDOW_MS,
);

const authLimiter = new MemoryRateLimiter(
  AUTH_RATE_LIMIT_MAX_ATTEMPTS,
  AUTH_RATE_LIMIT_WINDOW_MS,
);

export function limitCustomerStreams(
  _req: IncomingMessage,
  _res: ServerResponse,
  context: RequestContext,
): void {
  if (loadApiEnv().nodeEnv === "test") {
    return;
  }

  const key = `customer-sse:${context.user?.id ?? context.ip}`;

  if (!streamLimiter.consume(key)) {
    throw new RateLimitError();
  }
}

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

export function limitCustomerMutations(
  req: IncomingMessage,
  _res: ServerResponse,
  context: RequestContext,
): void {
  if (loadApiEnv().nodeEnv === "test") {
    return;
  }

  const key = `customer:${context.user?.id ?? context.ip}:${req.method}:${context.path}`;

  if (!customerMutationLimiter.consume(key)) {
    throw new RateLimitError();
  }
}

export function limitPublicQuoteMutations(
  _req: IncomingMessage,
  _res: ServerResponse,
  context: RequestContext,
): void {
  if (loadApiEnv().nodeEnv === "test") {
    return;
  }

  const key = `quote:${context.ip}`;

  if (!quoteLimiter.consume(key)) {
    throw new RateLimitError();
  }
}

export function limitPublicNewsletterMutations(
  _req: IncomingMessage,
  _res: ServerResponse,
  context: RequestContext,
): void {
  if (loadApiEnv().nodeEnv === "test") {
    return;
  }

  const key = `newsletter:${context.ip}`;

  if (!newsletterLimiter.consume(key)) {
    throw new RateLimitError();
  }
}

export function limitAuthMutations(
  _req: IncomingMessage,
  _res: ServerResponse,
  context: RequestContext,
): void {
  if (loadApiEnv().nodeEnv === "test") {
    return;
  }

  const key = `auth:${context.path}:${context.ip}`;

  if (!authLimiter.consume(key)) {
    throw new RateLimitError();
  }
}

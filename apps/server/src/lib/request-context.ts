import { randomUUID } from "node:crypto";
import type { IncomingMessage } from "node:http";
import type { AuthUser } from "./auth/types.ts";
import { InternalServerError } from "./errors.ts";

export interface RequestInput {
  body?: unknown;
  headers?: unknown;
  params?: unknown;
  query?: unknown;
}

export interface RequestContext {
  input: RequestInput;
  ip: string;
  method: string;
  params: Record<string, string>;
  path: string;
  requestId: string;
  startedAt: number;
  user: AuthUser | null;
}

const contexts = new WeakMap<IncomingMessage, RequestContext>();

export function createRequestContext(input: {
  ip: string;
  method: string;
  path: string;
  requestId?: string;
}): RequestContext {
  return {
    input: {},
    ip: input.ip,
    method: input.method,
    params: {},
    path: input.path,
    requestId: input.requestId ?? randomUUID(),
    startedAt: Date.now(),
    user: null,
  };
}

export function bindRequestContext(
  req: IncomingMessage,
  context: RequestContext,
): RequestContext {
  contexts.set(req, context);
  return context;
}

export function getRequestContext(req: IncomingMessage): RequestContext {
  const context = contexts.get(req);

  if (context === undefined) {
    throw new Error("Request context is not available.");
  }

  return context;
}

export function tryGetRequestContext(
  req: IncomingMessage,
): RequestContext | undefined {
  return contexts.get(req);
}

export function getValidatedBody<T>(context: RequestContext): T {
  return readValidated<T>(context.input.body);
}

export function getValidatedQuery<T>(context: RequestContext): T {
  return readValidated<T>(context.input.query);
}

export function getValidatedParams<T>(context: RequestContext): T {
  return readValidated<T>(context.input.params);
}

export function getValidatedHeaders<T>(context: RequestContext): T {
  return readValidated<T>(context.input.headers);
}

function readValidated<T>(value: unknown): T {
  if (value === undefined) {
    throw new InternalServerError();
  }

  return value as T;
}

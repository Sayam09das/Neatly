import { randomUUID } from "node:crypto";
import type { IncomingMessage } from "node:http";
import type { AuthUser } from "./auth/types.ts";

export interface RequestContext {
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

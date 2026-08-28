import type { IncomingMessage, ServerResponse } from "node:http";
import { logInfo } from "../lib/logger.ts";
import type { RequestContext } from "../lib/request-context.ts";

export function logRequestCompletion(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): void {
  logInfo("request", {
    durationMs: Date.now() - context.startedAt,
    method: context.method,
    path: context.path,
    requestId: context.requestId,
    status: res.statusCode,
  });
}

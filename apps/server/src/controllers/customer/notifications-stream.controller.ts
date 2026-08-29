import { randomUUID } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";
import { ADMIN_SSE_HEARTBEAT_MS } from "../../config/constants.ts";
import { sessionCustomerIdentityFromContext } from "../../lib/domain/http-actor.ts";
import { connectAdminSse } from "../../lib/events/admin-connection-manager.ts";
import type { RequestContext } from "../../lib/request-context.ts";

export function streamCustomerNotificationsController(
  req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): void {
  const identity = sessionCustomerIdentityFromContext(context);

  res.statusCode = 200;
  res.setHeader("cache-control", "no-store");
  res.setHeader("connection", "keep-alive");
  res.setHeader("content-type", "text/event-stream; charset=utf-8");
  res.setHeader("x-accel-buffering", "no");

  const connection = connectAdminSse(identity.id, req, res);
  connection.send("ready", {
    eventId: randomUUID(),
    timestamp: new Date().toISOString(),
  });

  const heartbeat = setInterval((): void => {
    connection.comment("ping");
  }, ADMIN_SSE_HEARTBEAT_MS);

  heartbeat.unref();

  req.on("close", (): void => {
    clearInterval(heartbeat);
  });
}

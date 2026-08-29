import { randomUUID } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";
import { ADMIN_SSE_HEARTBEAT_MS } from "../../config/constants.ts";
import { actorFromContext } from "../../lib/domain/http-actor.ts";
import { connectAdminSse } from "../../lib/events/admin-connection-manager.ts";
import type { RequestContext } from "../../lib/request-context.ts";

export function streamNotificationsController(
  req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): void {
  const actor = actorFromContext(context);

  res.statusCode = 200;
  res.setHeader("cache-control", "no-store");
  res.setHeader("connection", "keep-alive");
  res.setHeader("content-type", "text/event-stream; charset=utf-8");
  res.setHeader("x-accel-buffering", "no");

  const connection = connectAdminSse(actor.id, req, res);
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

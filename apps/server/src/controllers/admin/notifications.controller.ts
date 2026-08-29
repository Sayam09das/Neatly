import type { IncomingMessage, ServerResponse } from "node:http";
import { HTTP_STATUS } from "../../config/constants.ts";
import { actorFromContext } from "../../lib/domain/http-actor.ts";
import { getDomainServices } from "../../lib/domain/runtime.ts";
import { sendSuccess } from "../../lib/http.ts";
import {
  getValidatedBody,
  getValidatedParams,
  getValidatedQuery,
  type RequestContext,
} from "../../lib/request-context.ts";
import type {
  CreateNotificationBody,
  NotificationListQueryInput,
} from "../../lib/validations/admin.schema.ts";

export async function listNotificationsController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const actor = actorFromContext(context);
  const query = getValidatedQuery<NotificationListQueryInput>(context);
  const result = await getDomainServices().notifications.list(actor, {
    pagination: query.pagination,
    recipientId: actor.id,
    sort: query.sort,
    unreadOnly: query.unreadOnly,
  });
  sendSuccess(res, result);
}

export async function createNotificationController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const notification = await getDomainServices().notifications.create(
    actorFromContext(context),
    getValidatedBody<CreateNotificationBody>(context),
  );
  sendSuccess(res, { notification }, { statusCode: HTTP_STATUS.CREATED });
}

export async function markNotificationReadController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const { id } = getValidatedParams<{ id: string }>(context);
  const notification = await getDomainServices().notifications.markRead(
    actorFromContext(context),
    id,
  );
  sendSuccess(res, { notification });
}

export async function markAllNotificationsReadController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const actor = actorFromContext(context);
  const updated = await getDomainServices().notifications.markAllRead(
    actor,
    actor.id,
  );
  sendSuccess(res, { updated });
}

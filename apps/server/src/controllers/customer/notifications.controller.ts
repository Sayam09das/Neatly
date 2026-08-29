import type { IncomingMessage, ServerResponse } from "node:http";
import { sessionCustomerIdentityFromContext } from "../../lib/domain/http-actor.ts";
import { getDomainServices } from "../../lib/domain/runtime.ts";
import { sendSuccess } from "../../lib/http.ts";
import {
  getValidatedParams,
  getValidatedQuery,
  type RequestContext,
} from "../../lib/request-context.ts";
import type { CustomerNotificationListQueryInput } from "../../lib/validations/customer-notification.schema.ts";

export async function listCustomerNotificationsController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const result = await getDomainServices().notifications.listForCustomer(
    sessionCustomerIdentityFromContext(context),
    getValidatedQuery<CustomerNotificationListQueryInput>(context),
  );
  sendSuccess(res, {
    items: result.items,
    pagination: result.pagination,
  });
}

export async function getCustomerUnreadNotificationCountController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const count = await getDomainServices().notifications.countUnreadForCustomer(
    sessionCustomerIdentityFromContext(context),
  );
  sendSuccess(res, { count });
}

export async function getCustomerNotificationController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const { id } = getValidatedParams<{ id: string }>(context);
  const notification = await getDomainServices().notifications.getForCustomer(
    sessionCustomerIdentityFromContext(context),
    id,
  );
  sendSuccess(res, { notification });
}

export async function markCustomerNotificationReadController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const { id } = getValidatedParams<{ id: string }>(context);
  const notification =
    await getDomainServices().notifications.markReadForCustomer(
      sessionCustomerIdentityFromContext(context),
      id,
    );
  sendSuccess(res, { notification });
}

export async function markAllCustomerNotificationsReadController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const updated =
    await getDomainServices().notifications.markAllReadForCustomer(
      sessionCustomerIdentityFromContext(context),
    );
  sendSuccess(res, { updated });
}

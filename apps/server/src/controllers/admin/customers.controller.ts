import type { IncomingMessage, ServerResponse } from "node:http";
import { HTTP_STATUS } from "../../config/constants.ts";
import { actorFromContext } from "../../lib/domain/http-actor.ts";
import { getDomainServices } from "../../lib/domain/runtime.ts";
import {
  ADMIN_APP_HREFS,
  ADMIN_EVENT_COPY,
} from "../../lib/events/admin-event-copy.ts";
import { publishAdminDomainEvent } from "../../lib/events/publisher.ts";
import { sendSuccess } from "../../lib/http.ts";
import {
  getValidatedBody,
  getValidatedParams,
  getValidatedQuery,
  type RequestContext,
} from "../../lib/request-context.ts";
import type {
  CreateCustomerBody,
  CustomerListQuery,
  CustomerStatusBody,
  UpdateCustomerBody,
} from "../../lib/validations/admin.schema.ts";

export async function listCustomersController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const result = await getDomainServices().customers.list(
    actorFromContext(context),
    getValidatedQuery<CustomerListQuery>(context),
  );
  sendSuccess(res, result);
}

export async function getCustomerController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const { id } = getValidatedParams<{ id: string }>(context);
  const customer = await getDomainServices().customers.getById(
    actorFromContext(context),
    id,
  );
  sendSuccess(res, { customer });
}

export async function createCustomerController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const actor = actorFromContext(context);
  const customer = await getDomainServices().customers.create(
    actor,
    getValidatedBody<CreateCustomerBody>(context),
  );
  sendSuccess(res, { customer }, { statusCode: HTTP_STATUS.CREATED });
  await publishAdminDomainEvent(actor, {
    entityId: customer.id,
    message: ADMIN_EVENT_COPY.customerCreated.message,
    relatedHref: ADMIN_APP_HREFS.customers,
    relatedLabel: ADMIN_EVENT_COPY.customerCreated.relatedLabel,
    title: ADMIN_EVENT_COPY.customerCreated.title,
    type: "CUSTOMER_CREATED",
  });
}

export async function updateCustomerController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const { id } = getValidatedParams<{ id: string }>(context);
  const actor = actorFromContext(context);
  const customer = await getDomainServices().customers.update(
    actor,
    id,
    getValidatedBody<UpdateCustomerBody>(context),
  );
  sendSuccess(res, { customer });
  await publishAdminDomainEvent(actor, {
    entityId: customer.id,
    message: ADMIN_EVENT_COPY.customerUpdated.message,
    relatedHref: ADMIN_APP_HREFS.customers,
    relatedLabel: ADMIN_EVENT_COPY.customerUpdated.relatedLabel,
    title: ADMIN_EVENT_COPY.customerUpdated.title,
    type: "CUSTOMER_UPDATED",
  });
}

export async function updateCustomerStatusController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const { id } = getValidatedParams<{ id: string }>(context);
  const { status } = getValidatedBody<CustomerStatusBody>(context);
  const actor = actorFromContext(context);
  const customers = getDomainServices().customers;
  const customer =
    status === "INACTIVE"
      ? await customers.deactivate(actor, id)
      : await customers.activate(actor, id);
  sendSuccess(res, { customer });
  await publishAdminDomainEvent(actor, {
    entityId: customer.id,
    message: ADMIN_EVENT_COPY.customerUpdated.message,
    relatedHref: ADMIN_APP_HREFS.customers,
    relatedLabel: ADMIN_EVENT_COPY.customerUpdated.relatedLabel,
    title: ADMIN_EVENT_COPY.customerUpdated.title,
    type: "CUSTOMER_UPDATED",
  });
}

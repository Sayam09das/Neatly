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
  const customer = await getDomainServices().customers.create(
    actorFromContext(context),
    getValidatedBody<CreateCustomerBody>(context),
  );
  sendSuccess(res, { customer }, { statusCode: HTTP_STATUS.CREATED });
}

export async function updateCustomerController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const { id } = getValidatedParams<{ id: string }>(context);
  const customer = await getDomainServices().customers.update(
    actorFromContext(context),
    id,
    getValidatedBody<UpdateCustomerBody>(context),
  );
  sendSuccess(res, { customer });
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
}

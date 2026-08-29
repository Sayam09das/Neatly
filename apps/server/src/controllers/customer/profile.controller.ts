import type { IncomingMessage, ServerResponse } from "node:http";
import {
  customerActorFromContext,
  sessionCustomerIdentityFromContext,
} from "../../lib/domain/http-actor.ts";
import { getDomainServices } from "../../lib/domain/runtime.ts";
import { sendSuccess } from "../../lib/http.ts";
import {
  getValidatedBody,
  type RequestContext,
} from "../../lib/request-context.ts";
import type { UpdateCustomerProfileBody } from "../../lib/validations/customer-account.schema.ts";

export async function getCustomerProfileController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const profile = await getDomainServices().customers.getForSession(
    customerActorFromContext(context),
    sessionCustomerIdentityFromContext(context),
  );
  sendSuccess(res, { profile });
}

export async function updateCustomerProfileController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const actor = customerActorFromContext(context);
  const identity = sessionCustomerIdentityFromContext(context);
  const profile = await getDomainServices().customers.updateForSession(
    actor,
    identity,
    getValidatedBody<UpdateCustomerProfileBody>(context),
  );

  if (profile.name !== identity.name) {
    await getDomainServices().users.updateOwnName(actor, profile.name);
  }

  sendSuccess(res, { profile });
}

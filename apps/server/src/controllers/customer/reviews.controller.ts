import type { IncomingMessage, ServerResponse } from "node:http";
import { HTTP_STATUS } from "../../config/constants.ts";
import {
  customerActorFromContext,
  sessionCustomerIdentityFromContext,
} from "../../lib/domain/http-actor.ts";
import { getDomainServices } from "../../lib/domain/runtime.ts";
import { sendSuccess } from "../../lib/http.ts";
import {
  getValidatedBody,
  getValidatedParams,
  type RequestContext,
} from "../../lib/request-context.ts";
import type {
  CreateCustomerReviewBody,
  UpdateCustomerReviewBody,
} from "../../lib/validations/customer-review.schema.ts";

export async function listCustomerReviewsController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const workspace = await getDomainServices().reviews.listForCustomer(
    customerActorFromContext(context),
    sessionCustomerIdentityFromContext(context),
  );
  sendSuccess(res, workspace);
}

export async function createCustomerReviewController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const review = await getDomainServices().reviews.createForCustomer(
    customerActorFromContext(context),
    sessionCustomerIdentityFromContext(context),
    getValidatedBody<CreateCustomerReviewBody>(context),
  );
  sendSuccess(res, { review }, { statusCode: HTTP_STATUS.CREATED });
}

export async function updateCustomerReviewController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const { id } = getValidatedParams<{ id: string }>(context);
  const review = await getDomainServices().reviews.updateForCustomer(
    customerActorFromContext(context),
    sessionCustomerIdentityFromContext(context),
    id,
    getValidatedBody<UpdateCustomerReviewBody>(context),
  );
  sendSuccess(res, { review });
}

export async function deleteCustomerReviewController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const { id } = getValidatedParams<{ id: string }>(context);
  const review = await getDomainServices().reviews.hideForCustomer(
    customerActorFromContext(context),
    sessionCustomerIdentityFromContext(context),
    id,
  );
  sendSuccess(res, { review });
}

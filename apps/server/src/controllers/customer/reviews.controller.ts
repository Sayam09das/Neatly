import type { IncomingMessage, ServerResponse } from "node:http";
import { HTTP_STATUS } from "../../config/constants.ts";
import {
  customerActorFromContext,
  sessionCustomerIdentityFromContext,
} from "../../lib/domain/http-actor.ts";
import { getDomainServices } from "../../lib/domain/runtime.ts";
import {
  CUSTOMER_APP_HREFS,
  CUSTOMER_EVENT_COPY,
} from "../../lib/events/customer-event-copy.ts";
import { recordCustomerInboxNotification } from "../../lib/events/publisher.ts";
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
  const identity = sessionCustomerIdentityFromContext(context);
  const review = await getDomainServices().reviews.createForCustomer(
    customerActorFromContext(context),
    identity,
    getValidatedBody<CreateCustomerReviewBody>(context),
  );
  sendSuccess(res, { review }, { statusCode: HTTP_STATUS.CREATED });
  await recordCustomerInboxNotification(identity.id, {
    entityId: review.id,
    message: CUSTOMER_EVENT_COPY.reviewCreated.message,
    relatedHref: CUSTOMER_APP_HREFS.reviews,
    relatedLabel: CUSTOMER_EVENT_COPY.reviewCreated.relatedLabel,
    title: CUSTOMER_EVENT_COPY.reviewCreated.title,
    type: "REVIEW_CREATED",
  });
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

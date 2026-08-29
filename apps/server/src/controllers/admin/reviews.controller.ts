import type { IncomingMessage, ServerResponse } from "node:http";
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
  ReviewListQueryInput,
  UpdateReviewBody,
} from "../../lib/validations/admin.schema.ts";

export async function listReviewsController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const actor = actorFromContext(context);
  const result = await getDomainServices().reviews.list(
    getValidatedQuery<ReviewListQueryInput>(context),
    actor,
  );
  sendSuccess(res, result);
}

export async function getReviewController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const { id } = getValidatedParams<{ id: string }>(context);
  const review = await getDomainServices().reviews.getById(
    id,
    actorFromContext(context),
  );
  sendSuccess(res, { review });
}

export async function updateReviewController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const { id } = getValidatedParams<{ id: string }>(context);
  const actor = actorFromContext(context);
  const review = await getDomainServices().reviews.update(
    actor,
    id,
    getValidatedBody<UpdateReviewBody>(context),
  );
  sendSuccess(res, { review });
  await publishAdminDomainEvent(actor, {
    entityId: review.id,
    message: ADMIN_EVENT_COPY.reviewModerated.message,
    relatedHref: ADMIN_APP_HREFS.reviews,
    relatedLabel: ADMIN_EVENT_COPY.reviewModerated.relatedLabel,
    title: ADMIN_EVENT_COPY.reviewModerated.title,
    type: "REVIEW_MODERATED",
  });
}

export async function hideReviewController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const { id } = getValidatedParams<{ id: string }>(context);
  const actor = actorFromContext(context);
  const review = await getDomainServices().reviews.hide(actor, id);
  sendSuccess(res, { review });
  await publishAdminDomainEvent(actor, {
    entityId: review.id,
    message: ADMIN_EVENT_COPY.reviewModerated.message,
    relatedHref: ADMIN_APP_HREFS.reviews,
    relatedLabel: ADMIN_EVENT_COPY.reviewModerated.relatedLabel,
    title: ADMIN_EVENT_COPY.reviewModerated.title,
    type: "REVIEW_MODERATED",
  });
}

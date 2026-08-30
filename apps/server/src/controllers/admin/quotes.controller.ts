import type { IncomingMessage, ServerResponse } from "node:http";
import { actorFromContext } from "../../lib/domain/http-actor.ts";
import { getDomainServices } from "../../lib/domain/runtime.ts";
import {
  ADMIN_APP_HREFS,
  ADMIN_EVENT_COPY,
} from "../../lib/events/admin-event-copy.ts";
import { CUSTOMER_EVENT_COPY } from "../../lib/events/customer-event-copy.ts";
import {
  notifyQuoteOwner,
  publishAdminDomainEvent,
} from "../../lib/events/publisher.ts";
import { sendSuccess } from "../../lib/http.ts";
import {
  getValidatedBody,
  getValidatedParams,
  getValidatedQuery,
  type RequestContext,
} from "../../lib/request-context.ts";
import type {
  QuoteListQueryInput,
  UpdateQuoteBody,
} from "../../lib/validations/admin.schema.ts";

export async function listQuotesController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const result = await getDomainServices().quotes.listForAdmin(
    actorFromContext(context),
    getValidatedQuery<QuoteListQueryInput>(context),
  );
  sendSuccess(res, result);
}

export async function getQuoteController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const { id } = getValidatedParams<{ id: string }>(context);
  const quoteRequest = await getDomainServices().quotes.getForAdmin(
    actorFromContext(context),
    id,
  );
  sendSuccess(res, { quoteRequest });
}

export async function updateQuoteController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const { id } = getValidatedParams<{ id: string }>(context);
  const actor = actorFromContext(context);
  const body = getValidatedBody<UpdateQuoteBody>(context);
  const previous = await getDomainServices().quotes.getForAdmin(actor, id);
  const quoteRequest = await getDomainServices().quotes.updateForAdmin(
    actor,
    id,
    body,
  );
  sendSuccess(res, { quoteRequest });

  const shouldNotifyQuoted =
    quoteRequest.status === "QUOTED" &&
    (previous.status !== "QUOTED" || body.quotedAmount !== undefined);

  if (shouldNotifyQuoted) {
    await notifyQuoteOwner(quoteRequest, {
      message: CUSTOMER_EVENT_COPY.quoteReady.message,
      relatedLabel: CUSTOMER_EVENT_COPY.quoteReady.relatedLabel,
      title: CUSTOMER_EVENT_COPY.quoteReady.title,
      type: "QUOTE_READY",
    });
    await publishAdminDomainEvent(actor, {
      entityId: quoteRequest.id,
      message: ADMIN_EVENT_COPY.quoteQuoted.message,
      relatedHref: ADMIN_APP_HREFS.quotes,
      relatedLabel: ADMIN_EVENT_COPY.quoteQuoted.relatedLabel,
      title: ADMIN_EVENT_COPY.quoteQuoted.title,
      type: "QUOTE_QUOTED",
    });
  }
}

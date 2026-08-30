import type { IncomingMessage, ServerResponse } from "node:http";
import { HTTP_STATUS } from "../../config/constants.ts";
import {
  customerActorFromContext,
  sessionCustomerIdentityFromContext,
} from "../../lib/domain/http-actor.ts";
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
import type { CustomerQuoteListQueryInput } from "../../lib/validations/customer-quote.schema.ts";
import type { CreatePublicQuoteBody } from "../../lib/validations/public-quote.schema.ts";

export async function createPublicQuoteController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const quoteRequest = await getDomainServices().quotes.createPublic(
    getValidatedBody<CreatePublicQuoteBody>(context),
  );
  sendSuccess(res, { quoteRequest }, { statusCode: HTTP_STATUS.CREATED });
}

export async function listCustomerQuotesController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const result = await getDomainServices().quotes.listForCustomer(
    sessionCustomerIdentityFromContext(context),
    getValidatedQuery<CustomerQuoteListQueryInput>(context),
  );
  sendSuccess(res, {
    items: result.items,
    pagination: result.pagination,
  });
}

export async function getCustomerQuoteController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const { id } = getValidatedParams<{ id: string }>(context);
  const quoteRequest = await getDomainServices().quotes.getForCustomer(
    sessionCustomerIdentityFromContext(context),
    id,
  );
  sendSuccess(res, { quoteRequest });
}

export async function acceptCustomerQuoteController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const { id } = getValidatedParams<{ id: string }>(context);
  const identity = sessionCustomerIdentityFromContext(context);
  const current = await getDomainServices().quotes.getForCustomer(identity, id);

  if (current.status === "ACCEPTED") {
    sendSuccess(res, { quoteRequest: current });
    return;
  }

  const quoteRequest = await getDomainServices().quotes.acceptForCustomer(
    identity,
    id,
  );
  sendSuccess(res, { quoteRequest });
  await publishAdminDomainEvent(customerActorFromContext(context), {
    entityId: quoteRequest.id,
    message: ADMIN_EVENT_COPY.quoteAccepted.message,
    relatedHref: ADMIN_APP_HREFS.quotes,
    relatedLabel: ADMIN_EVENT_COPY.quoteAccepted.relatedLabel,
    title: ADMIN_EVENT_COPY.quoteAccepted.title,
    type: "QUOTE_ACCEPTED",
  });
}

export async function declineCustomerQuoteController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const { id } = getValidatedParams<{ id: string }>(context);
  const quoteRequest = await getDomainServices().quotes.declineForCustomer(
    sessionCustomerIdentityFromContext(context),
    id,
  );
  sendSuccess(res, { quoteRequest });
}

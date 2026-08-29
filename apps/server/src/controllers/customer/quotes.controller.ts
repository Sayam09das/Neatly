import type { IncomingMessage, ServerResponse } from "node:http";
import { HTTP_STATUS } from "../../config/constants.ts";
import { sessionCustomerIdentityFromContext } from "../../lib/domain/http-actor.ts";
import { getDomainServices } from "../../lib/domain/runtime.ts";
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

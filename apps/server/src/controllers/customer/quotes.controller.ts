import type { IncomingMessage, ServerResponse } from "node:http";
import { HTTP_STATUS } from "../../config/constants.ts";
import { getDomainServices } from "../../lib/domain/runtime.ts";
import { sendSuccess } from "../../lib/http.ts";
import {
  getValidatedBody,
  type RequestContext,
} from "../../lib/request-context.ts";
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

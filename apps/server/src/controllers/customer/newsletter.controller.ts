import type { IncomingMessage, ServerResponse } from "node:http";
import { getDomainServices } from "../../lib/domain/runtime.ts";
import { sendSuccess } from "../../lib/http.ts";
import {
  getValidatedBody,
  type RequestContext,
} from "../../lib/request-context.ts";
import type { SubscribeNewsletterBody } from "../../lib/validations/public-newsletter.schema.ts";

export async function subscribePublicNewsletterController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const { email } = getValidatedBody<SubscribeNewsletterBody>(context);
  const result = await getDomainServices().cms.subscribeNewsletter(email);
  sendSuccess(res, result);
}

import type { IncomingMessage, ServerResponse } from "node:http";
import { getDomainServices } from "../../lib/domain/runtime.ts";
import { sendSuccess } from "../../lib/http.ts";
import type { RequestContext } from "../../lib/request-context.ts";

export async function listPublicTestimonialsController(
  _req: IncomingMessage,
  res: ServerResponse,
  _context: RequestContext,
): Promise<void> {
  const result = await getDomainServices().reviews.listPublic();
  sendSuccess(res, result);
}

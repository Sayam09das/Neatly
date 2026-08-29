import type { IncomingMessage, ServerResponse } from "node:http";
import { getDomainServices } from "../../lib/domain/runtime.ts";
import { sendSuccess } from "../../lib/http.ts";
import type { RequestContext } from "../../lib/request-context.ts";

export async function listCustomerHelpController(
  _req: IncomingMessage,
  res: ServerResponse,
  _context: RequestContext,
): Promise<void> {
  const help = await getDomainServices().catalog.listPublicHelp();
  sendSuccess(res, help);
}

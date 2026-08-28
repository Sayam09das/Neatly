import type { IncomingMessage, ServerResponse } from "node:http";
import { API_PATHS } from "../contracts/v1.ts";
import { sendSuccess } from "../lib/http.ts";
import type { RequestContext } from "../lib/request-context.ts";

export function adminNamespaceController(
  _req: IncomingMessage,
  res: ServerResponse,
  _context: RequestContext,
): void {
  sendSuccess(res, {
    namespace: "admin",
    path: API_PATHS.admin,
    status: "ok",
  });
}

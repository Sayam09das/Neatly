import type { IncomingMessage, ServerResponse } from "node:http";
import { getDomainServices } from "../../lib/domain/runtime.ts";
import { sendSuccess } from "../../lib/http.ts";
import {
  getValidatedQuery,
  type RequestContext,
} from "../../lib/request-context.ts";
import type { PublicCatalogListQueryInput } from "../../lib/validations/public-catalog.schema.ts";

export async function listPublicServicesController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const result = await getDomainServices().catalog.listPublic(
    getValidatedQuery<PublicCatalogListQueryInput>(context),
  );
  sendSuccess(res, result);
}

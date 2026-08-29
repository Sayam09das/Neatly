import type { IncomingMessage, ServerResponse } from "node:http";
import { getDomainServices } from "../../lib/domain/runtime.ts";
import { sendSuccess } from "../../lib/http.ts";
import {
  getValidatedParams,
  getValidatedQuery,
  type RequestContext,
} from "../../lib/request-context.ts";
import type {
  PublicCatalogListQueryInput,
  PublicCatalogSlugParam,
} from "../../lib/validations/public-catalog.schema.ts";

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

export async function getPublicServiceController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const { slug } = getValidatedParams<PublicCatalogSlugParam>(context);
  const service = await getDomainServices().catalog.getPublicBySlug(slug);
  sendSuccess(res, { service });
}

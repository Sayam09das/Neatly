import type { IncomingMessage, ServerResponse } from "node:http";
import { HTTP_STATUS } from "../../config/constants.ts";
import { actorFromContext } from "../../lib/domain/http-actor.ts";
import { getDomainServices } from "../../lib/domain/runtime.ts";
import { sendSuccess } from "../../lib/http.ts";
import {
  getValidatedBody,
  getValidatedParams,
  getValidatedQuery,
  type RequestContext,
} from "../../lib/request-context.ts";
import type {
  CatalogListQueryInput,
  CreateCatalogBody,
  UpdateCatalogBody,
} from "../../lib/validations/admin.schema.ts";

export async function listServicesController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const actor = actorFromContext(context);
  const result = await getDomainServices().catalog.list(
    getValidatedQuery<CatalogListQueryInput>(context),
    actor,
  );
  sendSuccess(res, result);
}

export async function getServiceController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const { id } = getValidatedParams<{ id: string }>(context);
  const service = await getDomainServices().catalog.getById(
    id,
    actorFromContext(context),
  );
  sendSuccess(res, { service });
}

export async function createServiceController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const service = await getDomainServices().catalog.create(
    actorFromContext(context),
    getValidatedBody<CreateCatalogBody>(context),
  );
  sendSuccess(res, { service }, { statusCode: HTTP_STATUS.CREATED });
}

export async function updateServiceController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const { id } = getValidatedParams<{ id: string }>(context);
  const service = await getDomainServices().catalog.update(
    actorFromContext(context),
    id,
    getValidatedBody<UpdateCatalogBody>(context),
  );
  sendSuccess(res, { service });
}

export async function archiveServiceController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const { id } = getValidatedParams<{ id: string }>(context);
  const service = await getDomainServices().catalog.archive(
    actorFromContext(context),
    id,
  );
  sendSuccess(res, { service });
}

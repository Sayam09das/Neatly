import type { IncomingMessage, ServerResponse } from "node:http";
import { HTTP_STATUS } from "../../config/constants.ts";
import { actorFromContext } from "../../lib/domain/http-actor.ts";
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
  const actor = actorFromContext(context);
  const service = await getDomainServices().catalog.create(
    actor,
    getValidatedBody<CreateCatalogBody>(context),
  );
  sendSuccess(res, { service }, { statusCode: HTTP_STATUS.CREATED });
  await publishAdminDomainEvent(actor, {
    entityId: service.id,
    message: ADMIN_EVENT_COPY.serviceCreated.message,
    relatedHref: ADMIN_APP_HREFS.services,
    relatedLabel: ADMIN_EVENT_COPY.serviceCreated.relatedLabel,
    title: ADMIN_EVENT_COPY.serviceCreated.title,
    type: "SERVICE_CREATED",
  });
}

export async function updateServiceController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const { id } = getValidatedParams<{ id: string }>(context);
  const actor = actorFromContext(context);
  const service = await getDomainServices().catalog.update(
    actor,
    id,
    getValidatedBody<UpdateCatalogBody>(context),
  );
  sendSuccess(res, { service });
  await publishAdminDomainEvent(actor, {
    entityId: service.id,
    message: ADMIN_EVENT_COPY.serviceUpdated.message,
    relatedHref: ADMIN_APP_HREFS.services,
    relatedLabel: ADMIN_EVENT_COPY.serviceUpdated.relatedLabel,
    title: ADMIN_EVENT_COPY.serviceUpdated.title,
    type: "SERVICE_UPDATED",
  });
}

export async function archiveServiceController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const { id } = getValidatedParams<{ id: string }>(context);
  const actor = actorFromContext(context);
  const service = await getDomainServices().catalog.archive(actor, id);
  sendSuccess(res, { service });
  await publishAdminDomainEvent(actor, {
    entityId: service.id,
    message: ADMIN_EVENT_COPY.serviceStatusChanged.message,
    relatedHref: ADMIN_APP_HREFS.services,
    relatedLabel: ADMIN_EVENT_COPY.serviceStatusChanged.relatedLabel,
    title: ADMIN_EVENT_COPY.serviceStatusChanged.title,
    type: "SERVICE_STATUS_CHANGED",
  });
}

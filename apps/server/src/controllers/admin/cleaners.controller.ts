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
  CleanerListQuery,
  CleanerStatusBody,
  CreateCleanerBody,
  UpdateCleanerBody,
} from "../../lib/validations/admin.schema.ts";

export async function listCleanersController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const result = await getDomainServices().cleaners.list(
    actorFromContext(context),
    getValidatedQuery<CleanerListQuery>(context),
  );
  sendSuccess(res, result);
}

export async function getCleanerController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const { id } = getValidatedParams<{ id: string }>(context);
  const cleaner = await getDomainServices().cleaners.getById(
    actorFromContext(context),
    id,
  );
  sendSuccess(res, { cleaner });
}

export async function createCleanerController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const actor = actorFromContext(context);
  const result = await getDomainServices().cleaners.invite(
    actor,
    getValidatedBody<CreateCleanerBody>(context),
    { ip: context.ip },
  );
  sendSuccess(
    res,
    {
      cleaner: result.cleaner,
      invitationSent: result.invitationSent,
    },
    { statusCode: HTTP_STATUS.CREATED },
  );
  await publishAdminDomainEvent(actor, {
    entityId: result.cleaner.id,
    message: ADMIN_EVENT_COPY.cleanerCreated.message,
    relatedHref: ADMIN_APP_HREFS.cleaners,
    relatedLabel: ADMIN_EVENT_COPY.cleanerCreated.relatedLabel,
    title: ADMIN_EVENT_COPY.cleanerCreated.title,
    type: "CLEANER_CREATED",
  });
}

export async function resendCleanerInvitationController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const { id } = getValidatedParams<{ id: string }>(context);
  const actor = actorFromContext(context);
  const result = await getDomainServices().cleaners.resendInvitation(
    actor,
    id,
    { ip: context.ip },
  );
  sendSuccess(res, {
    cleaner: result.cleaner,
    invitationSent: result.invitationSent,
  });
}

export async function updateCleanerController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const { id } = getValidatedParams<{ id: string }>(context);
  const actor = actorFromContext(context);
  const cleaner = await getDomainServices().cleaners.update(
    actor,
    id,
    getValidatedBody<UpdateCleanerBody>(context),
  );
  sendSuccess(res, { cleaner });
  await publishAdminDomainEvent(actor, {
    entityId: cleaner.id,
    message: ADMIN_EVENT_COPY.cleanerUpdated.message,
    relatedHref: ADMIN_APP_HREFS.cleaners,
    relatedLabel: ADMIN_EVENT_COPY.cleanerUpdated.relatedLabel,
    title: ADMIN_EVENT_COPY.cleanerUpdated.title,
    type: "CLEANER_UPDATED",
  });
}

export async function updateCleanerStatusController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const { id } = getValidatedParams<{ id: string }>(context);
  const { status } = getValidatedBody<CleanerStatusBody>(context);
  const actor = actorFromContext(context);
  const cleaners = getDomainServices().cleaners;
  const cleaner =
    status === "INACTIVE"
      ? await cleaners.deactivate(actor, id)
      : await cleaners.activate(actor, id);
  sendSuccess(res, { cleaner });
  await publishAdminDomainEvent(actor, {
    entityId: cleaner.id,
    message: ADMIN_EVENT_COPY.cleanerStatusChanged.message,
    relatedHref: ADMIN_APP_HREFS.cleaners,
    relatedLabel: ADMIN_EVENT_COPY.cleanerStatusChanged.relatedLabel,
    title: ADMIN_EVENT_COPY.cleanerStatusChanged.title,
    type: "CLEANER_STATUS_CHANGED",
  });
}

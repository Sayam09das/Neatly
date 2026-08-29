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
  const cleaner = await getDomainServices().cleaners.create(
    actorFromContext(context),
    getValidatedBody<CreateCleanerBody>(context),
  );
  sendSuccess(res, { cleaner }, { statusCode: HTTP_STATUS.CREATED });
}

export async function updateCleanerController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const { id } = getValidatedParams<{ id: string }>(context);
  const cleaner = await getDomainServices().cleaners.update(
    actorFromContext(context),
    id,
    getValidatedBody<UpdateCleanerBody>(context),
  );
  sendSuccess(res, { cleaner });
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
}

import type { IncomingMessage, ServerResponse } from "node:http";
import { actorFromContext } from "../../lib/domain/http-actor.ts";
import { getDomainServices } from "../../lib/domain/runtime.ts";
import { sendSuccess } from "../../lib/http.ts";
import {
  getValidatedBody,
  type RequestContext,
} from "../../lib/request-context.ts";
import type { UpdateSettingsBody } from "../../lib/validations/admin.schema.ts";

export async function getSettingsController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const settings = await getDomainServices().settings.get(
    actorFromContext(context),
  );
  sendSuccess(res, { settings });
}

export async function updateSettingsController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const settings = await getDomainServices().settings.update(
    actorFromContext(context),
    getValidatedBody<UpdateSettingsBody>(context),
  );
  sendSuccess(res, { settings });
}

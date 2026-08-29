import type { IncomingMessage, ServerResponse } from "node:http";
import { isAdminOperatorRole } from "../../lib/auth/authorization.ts";
import { cleanerActorFromContext } from "../../lib/domain/http-actor.ts";
import { getDomainServices } from "../../lib/domain/runtime.ts";
import { AuthorizationError } from "../../lib/errors.ts";
import { sendSuccess } from "../../lib/http.ts";
import {
  getValidatedBody,
  type RequestContext,
} from "../../lib/request-context.ts";
import type { UpdateCleanerAvailabilityBody } from "../../lib/validations/cleaner-availability.schema.ts";

function assertCleanerOperator(context: RequestContext): void {
  if (context.user !== null && isAdminOperatorRole(context.user.role)) {
    throw new AuthorizationError();
  }
}

export async function getCleanerAvailabilityController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  assertCleanerOperator(context);
  const availability = await getDomainServices().cleaners.getAvailability(
    cleanerActorFromContext(context),
  );
  sendSuccess(res, { availability });
}

export async function updateCleanerAvailabilityController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  assertCleanerOperator(context);
  const body = getValidatedBody<UpdateCleanerAvailabilityBody>(context);
  const availability = await getDomainServices().cleaners.updateAvailability(
    cleanerActorFromContext(context),
    body.week,
  );
  sendSuccess(res, { availability });
}

import type { IncomingMessage, ServerResponse } from "node:http";
import { isAdminOperatorRole } from "../../lib/auth/authorization.ts";
import { cleanerActorFromContext } from "../../lib/domain/http-actor.ts";
import { getDomainServices } from "../../lib/domain/runtime.ts";
import { AuthorizationError } from "../../lib/errors.ts";
import { sendSuccess } from "../../lib/http.ts";
import type { RequestContext } from "../../lib/request-context.ts";

export async function getCleanerSessionController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  if (context.user !== null && isAdminOperatorRole(context.user.role)) {
    throw new AuthorizationError();
  }

  const profile = await getDomainServices().cleaners.getForSession(
    cleanerActorFromContext(context),
  );
  sendSuccess(res, { profile });
}

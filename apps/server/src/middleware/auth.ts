import type { IncomingMessage, ServerResponse } from "node:http";
import {
  requireRole as assertAssignedRole,
  requireAdminOperator,
} from "../lib/auth/authorization.ts";
import { AuthError } from "../lib/auth/errors.ts";
import { getSessionToken } from "../lib/auth/http.ts";
import { toAppErrorFromAuth } from "../lib/auth/http-error.ts";
import { getAuthService } from "../lib/auth/runtime.ts";
import type { AuthUserRole } from "../lib/auth/types.ts";
import { AuthenticationError } from "../lib/errors.ts";
import type { RequestContext } from "../lib/request-context.ts";
import type { Middleware } from "../lib/router.ts";

export async function requireAuth(
  req: IncomingMessage,
  _res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const user = await getAuthService().resolveSession(getSessionToken(req));

  if (user === null) {
    throw new AuthenticationError();
  }

  context.user = user;
}

export function requireAdminAccess(
  _req: IncomingMessage,
  _res: ServerResponse,
  context: RequestContext,
): void {
  assertAuthenticatedRole(context, (user) => requireAdminOperator(user));
}

export function requireRole(role: AuthUserRole): Middleware {
  return (
    _req: IncomingMessage,
    _res: ServerResponse,
    context: RequestContext,
  ): void => {
    assertAuthenticatedRole(context, (user) => assertAssignedRole(user, role));
  };
}

function assertAuthenticatedRole(
  context: RequestContext,
  authorize: (user: NonNullable<RequestContext["user"]>) => void,
): void {
  if (context.user === null) {
    throw new AuthenticationError();
  }

  try {
    authorize(context.user);
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      throw toAppErrorFromAuth(error);
    }

    throw error;
  }
}

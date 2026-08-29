import type { IncomingMessage, ServerResponse } from "node:http";
import { AuthError } from "../../lib/auth/errors.ts";
import { getSessionToken } from "../../lib/auth/http.ts";
import { toAppErrorFromAuth } from "../../lib/auth/http-error.ts";
import { getAuthService } from "../../lib/auth/runtime.ts";
import { AuthenticationError } from "../../lib/errors.ts";
import { sendSuccess } from "../../lib/http.ts";
import {
  getValidatedBody,
  getValidatedParams,
  type RequestContext,
} from "../../lib/request-context.ts";
import type { ChangeCustomerPasswordBody } from "../../lib/validations/customer-account.schema.ts";

export async function getCustomerAccountController(
  req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const user = requireSessionUser(context);

  try {
    const account = await getAuthService().getAccountSecurity(
      user.id,
      getSessionToken(req),
    );
    sendSuccess(res, { account });
  } catch (error: unknown) {
    throw toAccountError(error);
  }
}

export async function updateCustomerPasswordController(
  req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const user = requireSessionUser(context);

  try {
    await getAuthService().changeOwnPassword(
      user.id,
      getSessionToken(req),
      getValidatedBody<ChangeCustomerPasswordBody>(context),
      { ip: context.ip },
    );
    sendSuccess(res, { updated: true });
  } catch (error: unknown) {
    throw toAccountError(error);
  }
}

export async function resendCustomerVerificationController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const user = requireSessionUser(context);

  try {
    const result = await getAuthService().requestOwnEmailVerification(
      user.email,
      { ip: context.ip },
    );
    sendSuccess(res, result);
  } catch (error: unknown) {
    throw toAccountError(error);
  }
}

export async function revokeCustomerSessionController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const user = requireSessionUser(context);
  const { id } = getValidatedParams<{ id: string }>(context);

  try {
    await getAuthService().revokeOwnSession(user.id, id);
    sendSuccess(res, { revoked: true });
  } catch (error: unknown) {
    throw toAccountError(error);
  }
}

export async function logoutAllCustomerSessionsController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const user = requireSessionUser(context);

  try {
    await getAuthService().logoutAllOwnSessions(user.id);
    sendSuccess(res, { signedOut: true });
  } catch (error: unknown) {
    throw toAccountError(error);
  }
}

function requireSessionUser(
  context: RequestContext,
): NonNullable<RequestContext["user"]> {
  if (context.user === null) {
    throw new AuthenticationError();
  }

  return context.user;
}

function toAccountError(error: unknown): never {
  if (error instanceof AuthError) {
    throw toAppErrorFromAuth(error);
  }

  throw error;
}

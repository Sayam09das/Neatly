import type { IncomingMessage, ServerResponse } from "node:http";
import { loadApiEnv } from "../../config/env.ts";
import { AuthError } from "../../lib/auth/errors.ts";
import { toAppErrorFromAuth } from "../../lib/auth/http-error.ts";
import { getDomainServices } from "../../lib/domain/runtime.ts";
import { sendFailure, sendSuccess } from "../../lib/http.ts";
import {
  getValidatedBody,
  getValidatedQuery,
  type RequestContext,
} from "../../lib/request-context.ts";
import type {
  ActivateCleanerInvitationInput,
  InspectCleanerInvitationQuery,
} from "../../lib/validations/auth.schema.ts";

export async function inspectCleanerInvitationController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  await handleInvitation(res, context, async (): Promise<void> => {
    const { token } = getValidatedQuery<InspectCleanerInvitationQuery>(context);
    const invitation =
      await getDomainServices().cleaners.inspectInvitation(token);
    sendSuccess(res, { invitation });
  });
}

export async function activateCleanerInvitationController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  await handleInvitation(res, context, async (): Promise<void> => {
    const result = await getDomainServices().cleaners.activateInvitation(
      getValidatedBody<ActivateCleanerInvitationInput>(context),
      { ip: context.ip },
    );
    sendSuccess(res, {
      expiresAt: result.expiresAt.toISOString(),
      sessionToken: result.sessionToken,
      user: result.user,
    });
  });
}

async function handleInvitation(
  res: ServerResponse,
  context: RequestContext,
  action: () => Promise<void>,
): Promise<void> {
  try {
    await action();
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      sendFailure(
        res,
        toAppErrorFromAuth(error),
        loadApiEnv().nodeEnv,
        context.requestId,
      );
      return;
    }

    throw error;
  }
}

import type { IncomingMessage, ServerResponse } from "node:http";
import { loadApiEnv } from "../config/env.ts";
import { requireAdmin } from "../lib/auth/authorization.ts";
import { AuthError } from "../lib/auth/errors.ts";
import { getSessionToken } from "../lib/auth/http.ts";
import { toAppErrorFromAuth } from "../lib/auth/http-error.ts";
import { getAuthService } from "../lib/auth/runtime.ts";
import { sendFailure, sendSuccess } from "../lib/http.ts";
import {
  getValidatedBody,
  type RequestContext,
} from "../lib/request-context.ts";
import type {
  ForgotPasswordInput,
  LoginInput,
  RegisterUserInput,
  ResendVerificationInput,
  ResetPasswordInput,
  VerifyEmailInput,
} from "../lib/validations/auth.schema.ts";

export async function registerController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  await handleAuth(res, context, async (): Promise<void> => {
    const body = getValidatedBody<RegisterUserInput>(context);
    const user = await getAuthService().registerUser(body);
    sendSuccess(res, { user });
  });
}

export async function loginController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  await handleAuth(res, context, async (): Promise<void> => {
    const body = getValidatedBody<LoginInput>(context);
    const result = await getAuthService().authenticateUser(body, {
      ip: context.ip,
    });
    requireAdmin(result.user);
    sendSuccess(res, {
      expiresAt: result.expiresAt.toISOString(),
      sessionToken: result.sessionToken,
      user: result.user,
    });
  });
}

export async function logoutController(
  req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  await handleAuth(res, context, async (): Promise<void> => {
    await getAuthService().logout(getSessionToken(req));
    sendSuccess(res, { signedOut: true });
  });
}

export async function sessionController(
  req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  await handleAuth(res, context, async (): Promise<void> => {
    const user = await getAuthService().resolveSession(getSessionToken(req));

    if (user === null) {
      sendSuccess(res, { user: null });
      return;
    }

    requireAdmin(user);
    sendSuccess(res, { user });
  });
}

export async function forgotPasswordController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  await handleAuth(res, context, async (): Promise<void> => {
    const body = getValidatedBody<ForgotPasswordInput>(context);
    const result = await getAuthService().requestPasswordReset(body, {
      ip: context.ip,
    });
    sendSuccess(res, result);
  });
}

export async function resetPasswordController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  await handleAuth(res, context, async (): Promise<void> => {
    const body = getValidatedBody<ResetPasswordInput>(context);
    const user = await getAuthService().resetPassword(body, {
      ip: context.ip,
    });
    sendSuccess(res, {
      user: {
        email: user.email,
        id: user.id,
      },
    });
  });
}

export async function verifyEmailController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  await handleAuth(res, context, async (): Promise<void> => {
    const body = getValidatedBody<VerifyEmailInput>(context);
    const user = await getAuthService().verifyEmail(body, {
      ip: context.ip,
    });
    sendSuccess(res, {
      user: {
        email: user.email,
        id: user.id,
      },
    });
  });
}

export async function resendVerificationController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  await handleAuth(res, context, async (): Promise<void> => {
    const body = getValidatedBody<ResendVerificationInput>(context);
    const result = await getAuthService().requestEmailVerification(body, {
      ip: context.ip,
    });
    sendSuccess(res, result);
  });
}

async function handleAuth(
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

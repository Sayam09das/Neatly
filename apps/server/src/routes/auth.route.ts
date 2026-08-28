import type { IncomingMessage, ServerResponse } from "node:http";
import { loadApiEnv } from "../config/env.ts";
import { requireAdmin } from "../lib/auth/authorization.ts";
import { AuthError } from "../lib/auth/errors.ts";
import {
  getRequestIp,
  getSessionToken,
  readJsonBody,
} from "../lib/auth/http.ts";
import { toAppErrorFromAuth } from "../lib/auth/http-error.ts";
import { getAuthService } from "../lib/auth/runtime.ts";
import { sendFailure, sendSuccess } from "../lib/http.ts";

export async function registerHandler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  await handleAuth(req, res, async (): Promise<void> => {
    const body = await readJsonBody(req);
    const user = await getAuthService().registerUser(body);
    sendSuccess(res, { user });
  });
}

export async function loginHandler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  await handleAuth(req, res, async (): Promise<void> => {
    const body = await readJsonBody(req);
    const result = await getAuthService().authenticateUser(body, {
      ip: getRequestIp(req),
    });
    requireAdmin(result.user);
    sendSuccess(res, {
      expiresAt: result.expiresAt.toISOString(),
      sessionToken: result.sessionToken,
      user: result.user,
    });
  });
}

export async function logoutHandler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  await handleAuth(req, res, async (): Promise<void> => {
    await getAuthService().logout(getSessionToken(req));
    sendSuccess(res, { signedOut: true });
  });
}

export async function sessionHandler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  await handleAuth(req, res, async (): Promise<void> => {
    const user = await getAuthService().resolveSession(getSessionToken(req));

    if (user === null) {
      sendSuccess(res, { user: null });
      return;
    }

    requireAdmin(user);
    sendSuccess(res, { user });
  });
}

export async function forgotPasswordHandler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  await handleAuth(req, res, async (): Promise<void> => {
    const body = await readJsonBody(req);
    const result = await getAuthService().requestPasswordReset(body, {
      ip: getRequestIp(req),
    });
    sendSuccess(res, result);
  });
}

export async function resetPasswordHandler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  await handleAuth(req, res, async (): Promise<void> => {
    const body = await readJsonBody(req);
    const user = await getAuthService().resetPassword(body, {
      ip: getRequestIp(req),
    });
    sendSuccess(res, {
      user: {
        email: user.email,
        id: user.id,
      },
    });
  });
}

export async function verifyEmailHandler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  await handleAuth(req, res, async (): Promise<void> => {
    const body = await readJsonBody(req);
    const user = await getAuthService().verifyEmail(body);
    sendSuccess(res, {
      user: {
        email: user.email,
        id: user.id,
      },
    });
  });
}

export async function resendVerificationHandler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  await handleAuth(req, res, async (): Promise<void> => {
    const body = await readJsonBody(req);
    const result = await getAuthService().requestEmailVerification(body, {
      ip: getRequestIp(req),
    });
    sendSuccess(res, result);
  });
}

async function handleAuth(
  _req: IncomingMessage,
  res: ServerResponse,
  action: () => Promise<void>,
): Promise<void> {
  try {
    await action();
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      sendFailure(res, toAppErrorFromAuth(error), loadApiEnv().nodeEnv);
      return;
    }

    throw error;
  }
}

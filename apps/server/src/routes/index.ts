import type { IncomingMessage, ServerResponse } from "node:http";
import {
  createMethodNotAllowedError,
  createNotFoundError,
} from "../lib/errors.ts";
import { getRequestMethod, getRequestPath } from "../lib/http.ts";
import {
  forgotPasswordHandler,
  loginHandler,
  logoutHandler,
  registerHandler,
  resendVerificationHandler,
  resetPasswordHandler,
  sessionHandler,
  verifyEmailHandler,
} from "./auth.route.ts";
import { healthHandler } from "./health.route.ts";
import { rootHandler } from "./root.route.ts";

export type RouteHandler = (
  req: IncomingMessage,
  res: ServerResponse,
) => Promise<void> | void;

interface RouteDefinition {
  handler: RouteHandler;
  method: string;
  path: string;
}

const routes: readonly RouteDefinition[] = [
  {
    handler: rootHandler,
    method: "GET",
    path: "/",
  },
  {
    handler: rootHandler,
    method: "GET",
    path: "/api",
  },
  {
    handler: healthHandler,
    method: "GET",
    path: "/health",
  },
  {
    handler: registerHandler,
    method: "POST",
    path: "/auth/register",
  },
  {
    handler: loginHandler,
    method: "POST",
    path: "/auth/login",
  },
  {
    handler: logoutHandler,
    method: "POST",
    path: "/auth/logout",
  },
  {
    handler: sessionHandler,
    method: "GET",
    path: "/auth/session",
  },
  {
    handler: forgotPasswordHandler,
    method: "POST",
    path: "/auth/forgot-password",
  },
  {
    handler: resetPasswordHandler,
    method: "POST",
    path: "/auth/reset-password",
  },
  {
    handler: verifyEmailHandler,
    method: "POST",
    path: "/auth/verify-email",
  },
  {
    handler: resendVerificationHandler,
    method: "POST",
    path: "/auth/resend-verification",
  },
];

export function matchRoute(req: IncomingMessage): RouteHandler {
  const method = getRequestMethod(req);
  const path = getRequestPath(req);
  const pathMatches = routes.filter((route) => route.path === path);

  if (pathMatches.length === 0) {
    throw createNotFoundError();
  }

  const match = pathMatches.find((route) => route.method === method);

  if (match === undefined) {
    throw createMethodNotAllowedError();
  }

  return match.handler;
}

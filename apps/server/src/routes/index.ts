import type { IncomingMessage, ServerResponse } from "node:http";
import {
  createMethodNotAllowedError,
  createNotFoundError,
} from "../lib/errors.ts";
import { getRequestMethod, getRequestPath } from "../lib/http.ts";
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

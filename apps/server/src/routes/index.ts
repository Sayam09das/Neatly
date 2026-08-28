import { API_PATHS } from "../contracts/v1.ts";
import { rootController } from "../controllers/root.controller.ts";
import {
  createMethodNotAllowedError,
  createRouteNotFoundError,
} from "../lib/errors.ts";
import {
  compileRoutes,
  type Middleware,
  matchCompiledRoute,
  type RouteDefinition,
  type RouteHandler,
} from "../lib/router.ts";
import { healthRoutes } from "./health.routes.ts";
import { v1Routes } from "./v1/index.ts";

export interface MatchedRoute {
  handler: RouteHandler;
  middleware: readonly Middleware[];
  params: Record<string, string>;
}

const routes: readonly RouteDefinition[] = [
  {
    handler: rootController,
    method: "GET",
    path: API_PATHS.root,
  },
  {
    handler: rootController,
    method: "GET",
    path: API_PATHS.api,
  },
  ...healthRoutes,
  ...v1Routes,
];

const compiledRoutes = compileRoutes(routes);

export function resolveRoute(method: string, path: string): MatchedRoute {
  const match = matchCompiledRoute(compiledRoutes, method, path);

  if (match === null) {
    throw createRouteNotFoundError();
  }

  if (match === "method") {
    throw createMethodNotAllowedError();
  }

  return {
    handler: match.route.handler,
    middleware: match.route.middleware ?? [],
    params: match.params,
  };
}

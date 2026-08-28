import type { IncomingMessage, ServerResponse } from "node:http";
import type { RequestContext } from "../lib/request-context.ts";

export type Middleware = (
  req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
) => Promise<void> | void;

export type RouteHandler = (
  req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
) => Promise<void> | void;

export interface RouteDefinition {
  handler: RouteHandler;
  method: string;
  middleware?: readonly Middleware[];
  path: string;
}

interface CompiledRoute {
  definition: RouteDefinition;
  keys: readonly string[];
  pattern: RegExp;
}

export function compileRoutes(
  routes: readonly RouteDefinition[],
): readonly CompiledRoute[] {
  return routes.map((definition) => {
    const compiled = compilePath(definition.path);
    return {
      definition,
      keys: compiled.keys,
      pattern: compiled.pattern,
    };
  });
}

export function matchCompiledRoute(
  routes: readonly CompiledRoute[],
  method: string,
  path: string,
):
  | { params: Record<string, string>; route: RouteDefinition }
  | "method"
  | null {
  const pathMatches = routes.filter((route) => route.pattern.test(path));

  if (pathMatches.length === 0) {
    return null;
  }

  const methodMatch = pathMatches.find(
    (route) => route.definition.method === method,
  );

  if (methodMatch === undefined) {
    return "method";
  }

  const params = extractParams(methodMatch, path);
  return { params, route: methodMatch.definition };
}

function compilePath(path: string): {
  keys: readonly string[];
  pattern: RegExp;
} {
  const keys: string[] = [];
  const escaped = path
    .split("/")
    .map((segment) => {
      if (segment.startsWith(":") && segment.length > 1) {
        keys.push(segment.slice(1));
        return "([^/]+)";
      }

      return escapeRegExp(segment);
    })
    .join("/");

  return {
    keys,
    pattern: new RegExp(`^${escaped}$`),
  };
}

function extractParams(
  route: CompiledRoute,
  path: string,
): Record<string, string> {
  const match = route.pattern.exec(path);
  const params: Record<string, string> = {};

  if (match === null) {
    return params;
  }

  for (const [index, key] of route.keys.entries()) {
    const value = match[index + 1];

    if (value !== undefined) {
      params[key] = decodeURIComponent(value);
    }
  }

  return params;
}

function escapeRegExp(value: string): string {
  return value.replaceAll(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

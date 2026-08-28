import type { IncomingMessage, ServerResponse } from "node:http";
import type { z } from "@neatly/config/zod";
import { getRequestSearchParams } from "../lib/http.ts";
import { getHeader, readJsonBody } from "../lib/request.ts";
import type { RequestContext } from "../lib/request-context.ts";
import type { Middleware } from "../lib/router.ts";
import {
  parseWithSchema,
  searchParamsToRecord,
} from "../lib/validations/parse.ts";

const SKIPPED_HEADER_NAMES = new Set(["authorization", "cookie"]);

export function validateBody<T>(schema: z.ZodType<T>): Middleware {
  return async (
    req: IncomingMessage,
    _res: ServerResponse,
    context: RequestContext,
  ): Promise<void> => {
    const body = await readJsonBody(req);
    context.input.body = parseWithSchema(schema, body);
  };
}

export function validateQuery<T>(schema: z.ZodType<T>): Middleware {
  return (
    req: IncomingMessage,
    _res: ServerResponse,
    context: RequestContext,
  ): void => {
    context.input.query = parseWithSchema(
      schema,
      searchParamsToRecord(getRequestSearchParams(req)),
    );
  };
}

export function validateParams<T>(schema: z.ZodType<T>): Middleware {
  return (
    _req: IncomingMessage,
    _res: ServerResponse,
    context: RequestContext,
  ): void => {
    context.input.params = parseWithSchema(schema, context.params);
  };
}

export function validateHeaders<T>(schema: z.ZodType<T>): Middleware {
  return (
    req: IncomingMessage,
    _res: ServerResponse,
    context: RequestContext,
  ): void => {
    context.input.headers = parseWithSchema(schema, readHeaderRecord(req));
  };
}

function readHeaderRecord(req: IncomingMessage): Record<string, string> {
  const headers: Record<string, string> = Object.create(null) as Record<
    string,
    string
  >;

  for (const name of Object.keys(req.headers)) {
    if (SKIPPED_HEADER_NAMES.has(name)) {
      continue;
    }

    const value = getHeader(req, name);

    if (value !== undefined) {
      headers[name] = value;
    }
  }

  return headers;
}

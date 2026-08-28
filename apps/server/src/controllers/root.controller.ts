import type { IncomingMessage, ServerResponse } from "node:http";
import { API_HEALTH_STATUS, API_SERVICE_NAME } from "../config/constants.ts";
import { API_PATHS } from "../contracts/v1.ts";
import { sendSuccess } from "../lib/http.ts";
import type { RequestContext } from "../lib/request-context.ts";

export interface RootPayload {
  documentation: string;
  endpoints: {
    admin: string;
    auth: string;
    health: string;
    ready: string;
    v1: string;
  };
  name: string;
  service: string;
  status: "ok";
  version: string;
}

export function rootController(
  _req: IncomingMessage,
  res: ServerResponse,
  _context: RequestContext,
): void {
  const body: RootPayload = {
    documentation: API_PATHS.v1,
    endpoints: {
      admin: API_PATHS.admin,
      auth: `${API_PATHS.v1}/auth`,
      health: API_PATHS.health,
      ready: API_PATHS.ready,
      v1: API_PATHS.v1,
    },
    name: "Neatly API",
    service: API_SERVICE_NAME,
    status: "ok",
    version: "1.0.0",
  };

  sendSuccess(res, body);
}

export function v1RootController(
  _req: IncomingMessage,
  res: ServerResponse,
  _context: RequestContext,
): void {
  sendSuccess(res, {
    admin: API_PATHS.admin,
    auth: `${API_PATHS.v1}/auth`,
    version: "v1",
  });
}

export function healthController(
  _req: IncomingMessage,
  res: ServerResponse,
  _context: RequestContext,
): void {
  sendSuccess(res, {
    service: API_SERVICE_NAME,
    status: API_HEALTH_STATUS.OK,
  });
}

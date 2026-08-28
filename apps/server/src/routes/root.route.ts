import type { IncomingMessage, ServerResponse } from "node:http";
import { API_SERVICE_NAME } from "../config/constants.ts";
import { sendSuccess } from "../lib/http.ts";

export interface RootPayload {
  documentation: string;
  endpoints: {
    health: string;
  };
  name: string;
  service: string;
  status: "ok";
  version: string;
}

export function rootHandler(_req: IncomingMessage, res: ServerResponse): void {
  const body: RootPayload = {
    documentation: "/health",
    endpoints: {
      health: "/health",
    },
    name: "Neatly API",
    service: API_SERVICE_NAME,
    status: "ok",
    version: "1.0.0",
  };

  sendSuccess(res, body);
}

import type { IncomingMessage, ServerResponse } from "node:http";
import { API_SERVICE_NAME } from "../config/constants.ts";
import { sendSuccess } from "../lib/http.ts";

export interface HealthPayload {
  service: string;
  status: "ok";
}

export function healthHandler(
  _req: IncomingMessage,
  res: ServerResponse,
): void {
  const body: HealthPayload = {
    service: API_SERVICE_NAME,
    status: "ok",
  };

  sendSuccess(res, body);
}

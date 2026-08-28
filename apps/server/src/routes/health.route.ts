import type { IncomingMessage, ServerResponse } from "node:http";
import {
  API_HEALTH_STATUS,
  API_SERVICE_NAME,
  DATABASE_HEALTH_STATUS,
} from "../config/constants.ts";
import { loadApiEnv } from "../config/env.ts";
import { checkDatabaseConnection } from "../lib/database-health.ts";
import { createDatabaseUnavailableError } from "../lib/errors.ts";
import { sendFailure, sendSuccess } from "../lib/http.ts";

export interface HealthPayload {
  database: typeof DATABASE_HEALTH_STATUS.CONNECTED;
  service: string;
  status: typeof API_HEALTH_STATUS.OK;
}

export async function healthHandler(
  _req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  const env = loadApiEnv();
  const databaseConnected = await checkDatabaseConnection();

  if (!databaseConnected) {
    sendFailure(res, createDatabaseUnavailableError(), env.nodeEnv);
    return;
  }

  const body: HealthPayload = {
    database: DATABASE_HEALTH_STATUS.CONNECTED,
    service: API_SERVICE_NAME,
    status: API_HEALTH_STATUS.OK,
  };

  sendSuccess(res, body);
}

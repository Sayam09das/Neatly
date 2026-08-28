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
import type { RequestContext } from "../lib/request-context.ts";

export interface ReadyPayload {
  database: typeof DATABASE_HEALTH_STATUS.CONNECTED;
  service: string;
  status: typeof API_HEALTH_STATUS.OK;
}

export async function readyController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const env = loadApiEnv();
  const databaseConnected = await checkDatabaseConnection();

  if (!databaseConnected) {
    sendFailure(
      res,
      createDatabaseUnavailableError(),
      env.nodeEnv,
      context.requestId,
    );
    return;
  }

  const body: ReadyPayload = {
    database: DATABASE_HEALTH_STATUS.CONNECTED,
    service: API_SERVICE_NAME,
    status: API_HEALTH_STATUS.OK,
  };

  sendSuccess(res, body);
}

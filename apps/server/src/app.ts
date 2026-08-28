import { createServer, type Server } from "node:http";
import { loadApiEnv } from "./config/env.ts";
import {
  applySecurityHeaders,
  handleRequestError,
} from "./middleware/index.ts";
import { matchRoute } from "./routes/index.ts";

export function createApp(): Server {
  const env = loadApiEnv();

  return createServer((req, res): void => {
    applySecurityHeaders(req, res);

    void Promise.resolve()
      .then((): Promise<void> | void => {
        const handler = matchRoute(req);
        return handler(req, res);
      })
      .catch((error: unknown): void => {
        handleRequestError(error, req, res, env.nodeEnv);
      });
  });
}

import {
  createServer,
  type IncomingMessage,
  type Server,
  type ServerResponse,
} from "node:http";
import { loadApiEnv } from "./config/env.ts";
import {
  applyRequestIdHeader,
  getRequestMethod,
  getRequestPath,
} from "./lib/http.ts";
import { getRequestIp, readTrustedRequestId } from "./lib/request.ts";
import {
  bindRequestContext,
  createRequestContext,
} from "./lib/request-context.ts";
import {
  applyCors,
  applySecurityHeaders,
  handleRequestError,
  logRequestCompletion,
} from "./middleware/index.ts";
import { resolveRoute } from "./routes/index.ts";

export function createRequestListener(): (
  req: IncomingMessage,
  res: ServerResponse,
) => void {
  const env = loadApiEnv();

  return (req: IncomingMessage, res: ServerResponse): void => {
    const context = bindRequestContext(
      req,
      createRequestContext({
        ip: getRequestIp(req),
        method: getRequestMethod(req),
        path: getRequestPath(req),
        requestId: readTrustedRequestId(req),
      }),
    );

    applyRequestIdHeader(res, context.requestId);
    applySecurityHeaders(req, res);

    void Promise.resolve()
      .then(async (): Promise<void> => {
        const corsHandled = applyCors(req, res, env);

        if (corsHandled || res.headersSent) {
          return;
        }

        const matched = resolveRoute(context.method, context.path);
        context.params = matched.params;

        for (const middleware of matched.middleware) {
          await middleware(req, res, context);

          if (res.headersSent) {
            return;
          }
        }

        await matched.handler(req, res, context);
      })
      .catch((error: unknown): void => {
        handleRequestError(error, req, res, env.nodeEnv);
      })
      .finally((): void => {
        if (env.nodeEnv !== "test") {
          logRequestCompletion(req, res, context);
        }
      });
  };
}

export function createApp(): Server {
  return createServer(createRequestListener());
}

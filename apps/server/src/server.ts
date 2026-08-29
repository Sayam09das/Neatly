import type { Server } from "node:http";
import { createApp } from "./app.ts";
import { API_SHUTDOWN_TIMEOUT_MS } from "./config/constants.ts";
import { assertProductionConfig, loadApiEnv } from "./config/env.ts";
import { disconnectPrisma } from "./lib/db.ts";
import { closeAllAdminSse } from "./lib/events/admin-connection-manager.ts";
import { logError, logInfo } from "./lib/logger.ts";

assertProductionConfig();

const env = loadApiEnv();
const server = createApp();

server.listen(env.port, env.host, (): void => {
  logInfo("API listening", {
    host: env.host,
    port: env.port,
    service: "neatly-api",
  });
});

registerShutdown(server);

function registerShutdown(httpServer: Server): void {
  const signals = ["SIGINT", "SIGTERM"] as const;
  let shuttingDown = false;

  for (const signal of signals) {
    process.on(signal, (): void => {
      void shutdown(httpServer, signal);
    });
  }

  async function shutdown(
    activeServer: Server,
    signal: (typeof signals)[number],
  ): Promise<void> {
    if (shuttingDown) {
      return;
    }

    shuttingDown = true;
    logInfo("API shutting down", { signal });

    const forceExit = setTimeout((): void => {
      logError("API shutdown timed out");
      process.exit(1);
    }, API_SHUTDOWN_TIMEOUT_MS);

    forceExit.unref();

    try {
      closeAllAdminSse();
      await closeServer(activeServer);
      await disconnectPrisma();
      process.exit(0);
    } catch {
      logError("API shutdown failed");
      process.exit(1);
    }
  }
}

function closeServer(httpServer: Server): Promise<void> {
  return new Promise((resolve, reject): void => {
    httpServer.close((error: Error | undefined): void => {
      if (error !== undefined) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

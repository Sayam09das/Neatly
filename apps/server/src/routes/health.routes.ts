import { API_PATHS } from "../contracts/v1.ts";
import { readyController } from "../controllers/ready.controller.ts";
import { healthController } from "../controllers/root.controller.ts";
import type { RouteDefinition } from "../lib/router.ts";

export const healthRoutes: readonly RouteDefinition[] = [
  {
    handler: healthController,
    method: "GET",
    path: API_PATHS.health,
  },
  {
    handler: readyController,
    method: "GET",
    path: API_PATHS.ready,
  },
];

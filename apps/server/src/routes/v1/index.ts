import { API_PATHS } from "../../contracts/v1.ts";
import { v1RootController } from "../../controllers/root.controller.ts";
import type { RouteDefinition } from "../../lib/router.ts";
import { adminRoutes } from "./admin.routes.ts";
import { authRoutes } from "./auth.routes.ts";

export const v1Routes: readonly RouteDefinition[] = [
  {
    handler: v1RootController,
    method: "GET",
    path: API_PATHS.v1,
  },
  ...authRoutes,
  ...adminRoutes,
];

import { API_PATHS } from "../../contracts/v1.ts";
import { adminNamespaceController } from "../../controllers/admin.controller.ts";
import type { RouteDefinition } from "../../lib/router.ts";
import { requireAdminAccess, requireAuth } from "../../middleware/auth.ts";

export const adminRoutes: readonly RouteDefinition[] = [
  {
    handler: adminNamespaceController,
    method: "GET",
    middleware: [requireAuth, requireAdminAccess],
    path: API_PATHS.admin,
  },
];

import { API_PATHS } from "../../contracts/v1.ts";
import { listPublicServicesController } from "../../controllers/customer/services.controller.ts";
import type { RouteDefinition } from "../../lib/router.ts";
import { publicCatalogListQuerySchema } from "../../lib/validations/public-catalog.schema.ts";
import { validateQuery } from "../../middleware/index.ts";

export const customerRoutes: readonly RouteDefinition[] = [
  {
    handler: listPublicServicesController,
    method: "GET",
    middleware: [validateQuery(publicCatalogListQuerySchema)],
    path: API_PATHS.customerServices,
  },
];

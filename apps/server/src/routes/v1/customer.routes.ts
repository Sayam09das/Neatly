import { API_PATHS } from "../../contracts/v1.ts";
import {
  createCustomerBookingController,
  getCustomerBookingController,
} from "../../controllers/customer/bookings.controller.ts";
import { createPublicQuoteController } from "../../controllers/customer/quotes.controller.ts";
import {
  getPublicServiceController,
  listPublicServicesController,
} from "../../controllers/customer/services.controller.ts";
import type { RouteDefinition } from "../../lib/router.ts";
import { createCustomerBookingBodySchema } from "../../lib/validations/customer-booking.schema.ts";
import { idParamSchema } from "../../lib/validations/primitives.ts";
import {
  publicCatalogListQuerySchema,
  publicCatalogSlugParamSchema,
} from "../../lib/validations/public-catalog.schema.ts";
import { createPublicQuoteBodySchema } from "../../lib/validations/public-quote.schema.ts";
import {
  limitCustomerMutations,
  limitPublicQuoteMutations,
  requireAuth,
  validateBody,
  validateParams,
  validateQuery,
} from "../../middleware/index.ts";

export const customerRoutes: readonly RouteDefinition[] = [
  {
    handler: listPublicServicesController,
    method: "GET",
    middleware: [validateQuery(publicCatalogListQuerySchema)],
    path: API_PATHS.customerServices,
  },
  {
    handler: getPublicServiceController,
    method: "GET",
    middleware: [validateParams(publicCatalogSlugParamSchema)],
    path: API_PATHS.customerService,
  },
  {
    handler: createPublicQuoteController,
    method: "POST",
    middleware: [
      limitPublicQuoteMutations,
      validateBody(createPublicQuoteBodySchema),
    ],
    path: API_PATHS.customerQuotes,
  },
  {
    handler: createCustomerBookingController,
    method: "POST",
    middleware: [
      requireAuth,
      limitCustomerMutations,
      validateBody(createCustomerBookingBodySchema),
    ],
    path: API_PATHS.customerBookings,
  },
  {
    handler: getCustomerBookingController,
    method: "GET",
    middleware: [requireAuth, validateParams(idParamSchema)],
    path: API_PATHS.customerBooking,
  },
];

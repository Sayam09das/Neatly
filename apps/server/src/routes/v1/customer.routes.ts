import { API_PATHS } from "../../contracts/v1.ts";
import {
  getCustomerAccountController,
  logoutAllCustomerSessionsController,
  resendCustomerVerificationController,
  revokeCustomerSessionController,
  updateCustomerPasswordController,
} from "../../controllers/customer/account.controller.ts";
import {
  cancelCustomerBookingController,
  createCustomerBookingController,
  getCustomerBookingController,
  getCustomerOverviewController,
  listCustomerBookingsController,
  updateCustomerBookingController,
} from "../../controllers/customer/bookings.controller.ts";
import {
  getCustomerProfileController,
  updateCustomerProfileController,
} from "../../controllers/customer/profile.controller.ts";
import { createPublicQuoteController } from "../../controllers/customer/quotes.controller.ts";
import {
  createCustomerReviewController,
  deleteCustomerReviewController,
  listCustomerReviewsController,
  updateCustomerReviewController,
} from "../../controllers/customer/reviews.controller.ts";
import {
  getPublicServiceController,
  listPublicServicesController,
} from "../../controllers/customer/services.controller.ts";
import type { RouteDefinition } from "../../lib/router.ts";
import {
  changeCustomerPasswordBodySchema,
  updateCustomerProfileBodySchema,
} from "../../lib/validations/customer-account.schema.ts";
import {
  createCustomerBookingBodySchema,
  customerBookingListQuerySchema,
  updateCustomerBookingBodySchema,
} from "../../lib/validations/customer-booking.schema.ts";
import {
  createCustomerReviewBodySchema,
  customerReviewListQuerySchema,
  updateCustomerReviewBodySchema,
} from "../../lib/validations/customer-review.schema.ts";
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
    handler: getCustomerOverviewController,
    method: "GET",
    middleware: [requireAuth],
    path: API_PATHS.customerDashboard,
  },
  {
    handler: listCustomerBookingsController,
    method: "GET",
    middleware: [requireAuth, validateQuery(customerBookingListQuerySchema)],
    path: API_PATHS.customerBookings,
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
  {
    handler: updateCustomerBookingController,
    method: "PATCH",
    middleware: [
      requireAuth,
      limitCustomerMutations,
      validateParams(idParamSchema),
      validateBody(updateCustomerBookingBodySchema),
    ],
    path: API_PATHS.customerBooking,
  },
  {
    handler: cancelCustomerBookingController,
    method: "POST",
    middleware: [
      requireAuth,
      limitCustomerMutations,
      validateParams(idParamSchema),
    ],
    path: API_PATHS.customerBookingCancel,
  },
  {
    handler: getCustomerProfileController,
    method: "GET",
    middleware: [requireAuth],
    path: API_PATHS.customerMe,
  },
  {
    handler: updateCustomerProfileController,
    method: "PATCH",
    middleware: [
      requireAuth,
      limitCustomerMutations,
      validateBody(updateCustomerProfileBodySchema),
    ],
    path: API_PATHS.customerMe,
  },
  {
    handler: getCustomerAccountController,
    method: "GET",
    middleware: [requireAuth],
    path: API_PATHS.customerAccount,
  },
  {
    handler: updateCustomerPasswordController,
    method: "POST",
    middleware: [
      requireAuth,
      limitCustomerMutations,
      validateBody(changeCustomerPasswordBodySchema),
    ],
    path: API_PATHS.customerAccountPassword,
  },
  {
    handler: resendCustomerVerificationController,
    method: "POST",
    middleware: [requireAuth, limitCustomerMutations],
    path: API_PATHS.customerAccountVerifyEmail,
  },
  {
    handler: revokeCustomerSessionController,
    method: "POST",
    middleware: [
      requireAuth,
      limitCustomerMutations,
      validateParams(idParamSchema),
    ],
    path: API_PATHS.customerAccountSession,
  },
  {
    handler: logoutAllCustomerSessionsController,
    method: "POST",
    middleware: [requireAuth, limitCustomerMutations],
    path: API_PATHS.customerAccountLogoutAll,
  },
  {
    handler: listCustomerReviewsController,
    method: "GET",
    middleware: [requireAuth, validateQuery(customerReviewListQuerySchema)],
    path: API_PATHS.customerReviews,
  },
  {
    handler: createCustomerReviewController,
    method: "POST",
    middleware: [
      requireAuth,
      limitCustomerMutations,
      validateBody(createCustomerReviewBodySchema),
    ],
    path: API_PATHS.customerReviews,
  },
  {
    handler: updateCustomerReviewController,
    method: "PATCH",
    middleware: [
      requireAuth,
      limitCustomerMutations,
      validateParams(idParamSchema),
      validateBody(updateCustomerReviewBodySchema),
    ],
    path: API_PATHS.customerReview,
  },
  {
    handler: deleteCustomerReviewController,
    method: "POST",
    middleware: [
      requireAuth,
      limitCustomerMutations,
      validateParams(idParamSchema),
    ],
    path: API_PATHS.customerReviewDelete,
  },
];

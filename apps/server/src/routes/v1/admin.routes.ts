import { API_PATHS } from "../../contracts/v1.ts";
import {
  assignBookingCleanerController,
  changeBookingStatusController,
  createBookingController,
  getBookingController,
  listBookingsController,
  updateBookingController,
} from "../../controllers/admin/bookings.controller.ts";
import {
  createCleanerController,
  getCleanerController,
  listCleanersController,
  updateCleanerController,
  updateCleanerStatusController,
} from "../../controllers/admin/cleaners.controller.ts";
import {
  createCustomerController,
  getCustomerController,
  listCustomersController,
  updateCustomerController,
  updateCustomerStatusController,
} from "../../controllers/admin/customers.controller.ts";
import {
  adminDashboardController,
  adminMeController,
} from "../../controllers/admin/dashboard.controller.ts";
import {
  createNotificationController,
  listNotificationsController,
  markAllNotificationsReadController,
  markNotificationReadController,
} from "../../controllers/admin/notifications.controller.ts";
import {
  getReviewController,
  hideReviewController,
  listReviewsController,
  updateReviewController,
} from "../../controllers/admin/reviews.controller.ts";
import {
  archiveServiceController,
  createServiceController,
  getServiceController,
  listServicesController,
  updateServiceController,
} from "../../controllers/admin/services.controller.ts";
import {
  getSettingsController,
  updateSettingsController,
} from "../../controllers/admin/settings.controller.ts";
import { adminNamespaceController } from "../../controllers/admin.controller.ts";
import type { RouteDefinition } from "../../lib/router.ts";
import {
  assignCleanerBodySchema,
  bookingListQuerySchema,
  bookingStatusBodySchema,
  catalogListQuerySchema,
  cleanerListQuerySchema,
  cleanerStatusBodySchema,
  createBookingBodySchema,
  createCatalogBodySchema,
  createCleanerBodySchema,
  createCustomerBodySchema,
  createNotificationBodySchema,
  customerListQuerySchema,
  customerStatusBodySchema,
  notificationListQuerySchema,
  reviewListQuerySchema,
  updateBookingBodySchema,
  updateCatalogBodySchema,
  updateCleanerBodySchema,
  updateCustomerBodySchema,
  updateReviewBodySchema,
  updateSettingsBodySchema,
} from "../../lib/validations/admin.schema.ts";
import { idParamSchema } from "../../lib/validations/primitives.ts";
import {
  limitAdminMutations,
  requireAdminAccess,
  requireAuth,
  validateBody,
  validateParams,
  validateQuery,
} from "../../middleware/index.ts";

const adminAccess = [requireAuth, requireAdminAccess] as const;
const adminMutation = [
  requireAuth,
  requireAdminAccess,
  limitAdminMutations,
] as const;

export const adminRoutes: readonly RouteDefinition[] = [
  {
    handler: adminNamespaceController,
    method: "GET",
    middleware: adminAccess,
    path: API_PATHS.admin,
  },
  {
    handler: adminMeController,
    method: "GET",
    middleware: adminAccess,
    path: API_PATHS.adminMe,
  },
  {
    handler: adminDashboardController,
    method: "GET",
    middleware: adminAccess,
    path: API_PATHS.adminDashboard,
  },
  {
    handler: listCustomersController,
    method: "GET",
    middleware: [...adminAccess, validateQuery(customerListQuerySchema)],
    path: API_PATHS.adminCustomers,
  },
  {
    handler: createCustomerController,
    method: "POST",
    middleware: [...adminMutation, validateBody(createCustomerBodySchema)],
    path: API_PATHS.adminCustomers,
  },
  {
    handler: getCustomerController,
    method: "GET",
    middleware: [...adminAccess, validateParams(idParamSchema)],
    path: API_PATHS.adminCustomer,
  },
  {
    handler: updateCustomerController,
    method: "PATCH",
    middleware: [
      ...adminMutation,
      validateParams(idParamSchema),
      validateBody(updateCustomerBodySchema),
    ],
    path: API_PATHS.adminCustomer,
  },
  {
    handler: updateCustomerStatusController,
    method: "PATCH",
    middleware: [
      ...adminMutation,
      validateParams(idParamSchema),
      validateBody(customerStatusBodySchema),
    ],
    path: API_PATHS.adminCustomerStatus,
  },
  {
    handler: listCleanersController,
    method: "GET",
    middleware: [...adminAccess, validateQuery(cleanerListQuerySchema)],
    path: API_PATHS.adminCleaners,
  },
  {
    handler: createCleanerController,
    method: "POST",
    middleware: [...adminMutation, validateBody(createCleanerBodySchema)],
    path: API_PATHS.adminCleaners,
  },
  {
    handler: getCleanerController,
    method: "GET",
    middleware: [...adminAccess, validateParams(idParamSchema)],
    path: API_PATHS.adminCleaner,
  },
  {
    handler: updateCleanerController,
    method: "PATCH",
    middleware: [
      ...adminMutation,
      validateParams(idParamSchema),
      validateBody(updateCleanerBodySchema),
    ],
    path: API_PATHS.adminCleaner,
  },
  {
    handler: updateCleanerStatusController,
    method: "PATCH",
    middleware: [
      ...adminMutation,
      validateParams(idParamSchema),
      validateBody(cleanerStatusBodySchema),
    ],
    path: API_PATHS.adminCleanerStatus,
  },
  {
    handler: listServicesController,
    method: "GET",
    middleware: [...adminAccess, validateQuery(catalogListQuerySchema)],
    path: API_PATHS.adminServices,
  },
  {
    handler: createServiceController,
    method: "POST",
    middleware: [...adminMutation, validateBody(createCatalogBodySchema)],
    path: API_PATHS.adminServices,
  },
  {
    handler: getServiceController,
    method: "GET",
    middleware: [...adminAccess, validateParams(idParamSchema)],
    path: API_PATHS.adminService,
  },
  {
    handler: updateServiceController,
    method: "PATCH",
    middleware: [
      ...adminMutation,
      validateParams(idParamSchema),
      validateBody(updateCatalogBodySchema),
    ],
    path: API_PATHS.adminService,
  },
  {
    handler: archiveServiceController,
    method: "POST",
    middleware: [...adminMutation, validateParams(idParamSchema)],
    path: API_PATHS.adminServiceArchive,
  },
  {
    handler: listBookingsController,
    method: "GET",
    middleware: [...adminAccess, validateQuery(bookingListQuerySchema)],
    path: API_PATHS.adminBookings,
  },
  {
    handler: createBookingController,
    method: "POST",
    middleware: [...adminMutation, validateBody(createBookingBodySchema)],
    path: API_PATHS.adminBookings,
  },
  {
    handler: getBookingController,
    method: "GET",
    middleware: [...adminAccess, validateParams(idParamSchema)],
    path: API_PATHS.adminBooking,
  },
  {
    handler: updateBookingController,
    method: "PATCH",
    middleware: [
      ...adminMutation,
      validateParams(idParamSchema),
      validateBody(updateBookingBodySchema),
    ],
    path: API_PATHS.adminBooking,
  },
  {
    handler: changeBookingStatusController,
    method: "PATCH",
    middleware: [
      ...adminMutation,
      validateParams(idParamSchema),
      validateBody(bookingStatusBodySchema),
    ],
    path: API_PATHS.adminBookingStatus,
  },
  {
    handler: assignBookingCleanerController,
    method: "PATCH",
    middleware: [
      ...adminMutation,
      validateParams(idParamSchema),
      validateBody(assignCleanerBodySchema),
    ],
    path: API_PATHS.adminBookingAssign,
  },
  {
    handler: listReviewsController,
    method: "GET",
    middleware: [...adminAccess, validateQuery(reviewListQuerySchema)],
    path: API_PATHS.adminReviews,
  },
  {
    handler: getReviewController,
    method: "GET",
    middleware: [...adminAccess, validateParams(idParamSchema)],
    path: API_PATHS.adminReview,
  },
  {
    handler: updateReviewController,
    method: "PATCH",
    middleware: [
      ...adminMutation,
      validateParams(idParamSchema),
      validateBody(updateReviewBodySchema),
    ],
    path: API_PATHS.adminReview,
  },
  {
    handler: hideReviewController,
    method: "POST",
    middleware: [...adminMutation, validateParams(idParamSchema)],
    path: API_PATHS.adminReviewHide,
  },
  {
    handler: listNotificationsController,
    method: "GET",
    middleware: [...adminAccess, validateQuery(notificationListQuerySchema)],
    path: API_PATHS.adminNotifications,
  },
  {
    handler: createNotificationController,
    method: "POST",
    middleware: [...adminMutation, validateBody(createNotificationBodySchema)],
    path: API_PATHS.adminNotifications,
  },
  {
    handler: markAllNotificationsReadController,
    method: "POST",
    middleware: adminMutation,
    path: API_PATHS.adminNotificationsReadAll,
  },
  {
    handler: markNotificationReadController,
    method: "PATCH",
    middleware: [...adminMutation, validateParams(idParamSchema)],
    path: API_PATHS.adminNotificationRead,
  },
  {
    handler: getSettingsController,
    method: "GET",
    middleware: adminAccess,
    path: API_PATHS.adminSettings,
  },
  {
    handler: updateSettingsController,
    method: "PATCH",
    middleware: [...adminMutation, validateBody(updateSettingsBodySchema)],
    path: API_PATHS.adminSettings,
  },
];

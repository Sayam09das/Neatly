import { API_PATHS } from "../../contracts/v1.ts";
import {
  activateCleanerInvitationController,
  inspectCleanerInvitationController,
} from "../../controllers/cleaner/activate.controller.ts";
import {
  getCleanerAvailabilityController,
  updateCleanerAvailabilityController,
} from "../../controllers/cleaner/availability.controller.ts";
import {
  completeCleanerJobController,
  getCleanerJobController,
  getCleanerOverviewController,
  getCleanerScheduleController,
  listCleanerJobsController,
  startCleanerJobController,
} from "../../controllers/cleaner/jobs.controller.ts";
import { getCleanerSessionController } from "../../controllers/cleaner/me.controller.ts";
import type { RouteDefinition } from "../../lib/router.ts";
import {
  activateCleanerInvitationSchema,
  inspectCleanerInvitationQuerySchema,
} from "../../lib/validations/auth.schema.ts";
import { updateCleanerAvailabilityBodySchema } from "../../lib/validations/cleaner-availability.schema.ts";
import {
  cleanerJobListQuerySchema,
  cleanerScheduleQuerySchema,
} from "../../lib/validations/cleaner-job.schema.ts";
import { idParamSchema } from "../../lib/validations/primitives.ts";
import {
  limitCustomerMutations,
  requireAuth,
  validateBody,
  validateParams,
  validateQuery,
} from "../../middleware/index.ts";

export const cleanerRoutes: readonly RouteDefinition[] = [
  {
    handler: inspectCleanerInvitationController,
    method: "GET",
    middleware: [
      limitCustomerMutations,
      validateQuery(inspectCleanerInvitationQuerySchema),
    ],
    path: API_PATHS.cleanerActivate,
  },
  {
    handler: activateCleanerInvitationController,
    method: "POST",
    middleware: [
      limitCustomerMutations,
      validateBody(activateCleanerInvitationSchema),
    ],
    path: API_PATHS.cleanerActivate,
  },
  {
    handler: getCleanerSessionController,
    method: "GET",
    middleware: [requireAuth],
    path: API_PATHS.cleanerMe,
  },
  {
    handler: getCleanerOverviewController,
    method: "GET",
    middleware: [requireAuth],
    path: API_PATHS.cleanerDashboard,
  },
  {
    handler: getCleanerAvailabilityController,
    method: "GET",
    middleware: [requireAuth],
    path: API_PATHS.cleanerAvailability,
  },
  {
    handler: updateCleanerAvailabilityController,
    method: "PATCH",
    middleware: [
      requireAuth,
      limitCustomerMutations,
      validateBody(updateCleanerAvailabilityBodySchema),
    ],
    path: API_PATHS.cleanerAvailability,
  },
  {
    handler: getCleanerScheduleController,
    method: "GET",
    middleware: [requireAuth, validateQuery(cleanerScheduleQuerySchema)],
    path: API_PATHS.cleanerSchedule,
  },
  {
    handler: listCleanerJobsController,
    method: "GET",
    middleware: [requireAuth, validateQuery(cleanerJobListQuerySchema)],
    path: API_PATHS.cleanerJobs,
  },
  {
    handler: getCleanerJobController,
    method: "GET",
    middleware: [requireAuth, validateParams(idParamSchema)],
    path: API_PATHS.cleanerJob,
  },
  {
    handler: startCleanerJobController,
    method: "POST",
    middleware: [
      requireAuth,
      limitCustomerMutations,
      validateParams(idParamSchema),
    ],
    path: API_PATHS.cleanerJobStart,
  },
  {
    handler: completeCleanerJobController,
    method: "POST",
    middleware: [
      requireAuth,
      limitCustomerMutations,
      validateParams(idParamSchema),
    ],
    path: API_PATHS.cleanerJobComplete,
  },
];

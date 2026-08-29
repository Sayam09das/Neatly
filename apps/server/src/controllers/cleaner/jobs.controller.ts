import type { IncomingMessage, ServerResponse } from "node:http";
import { isAdminOperatorRole } from "../../lib/auth/authorization.ts";
import { cleanerActorFromContext } from "../../lib/domain/http-actor.ts";
import { getDomainServices } from "../../lib/domain/runtime.ts";
import { AuthorizationError } from "../../lib/errors.ts";
import { sendSuccess } from "../../lib/http.ts";
import {
  getValidatedParams,
  getValidatedQuery,
  type RequestContext,
} from "../../lib/request-context.ts";
import type {
  CleanerJobListQueryInput,
  CleanerScheduleQueryInput,
} from "../../lib/validations/cleaner-job.schema.ts";

function assertCleanerOperator(context: RequestContext): void {
  if (context.user !== null && isAdminOperatorRole(context.user.role)) {
    throw new AuthorizationError();
  }
}

export async function getCleanerOverviewController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  assertCleanerOperator(context);
  const overview = await getDomainServices().bookings.getCleanerOverview(
    cleanerActorFromContext(context),
  );
  sendSuccess(res, { overview });
}

export async function listCleanerJobsController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  assertCleanerOperator(context);
  const result = await getDomainServices().bookings.listForCleaner(
    cleanerActorFromContext(context),
    getValidatedQuery<CleanerJobListQueryInput>(context),
  );
  sendSuccess(res, {
    items: result.items,
    pagination: result.pagination,
  });
}

export async function getCleanerJobController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  assertCleanerOperator(context);
  const { id } = getValidatedParams<{ id: string }>(context);
  const job = await getDomainServices().bookings.getCleanerJob(
    cleanerActorFromContext(context),
    id,
  );
  sendSuccess(res, { job });
}

export async function getCleanerScheduleController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  assertCleanerOperator(context);
  const query = getValidatedQuery<CleanerScheduleQueryInput>(context);
  const schedule = await getDomainServices().bookings.getCleanerSchedule(
    cleanerActorFromContext(context),
    query.date,
  );
  sendSuccess(res, { schedule });
}

export async function startCleanerJobController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  assertCleanerOperator(context);
  const { id } = getValidatedParams<{ id: string }>(context);
  const job = await getDomainServices().bookings.startCleanerJob(
    cleanerActorFromContext(context),
    id,
  );
  sendSuccess(res, { job });
}

export async function completeCleanerJobController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  assertCleanerOperator(context);
  const { id } = getValidatedParams<{ id: string }>(context);
  const job = await getDomainServices().bookings.completeCleanerJob(
    cleanerActorFromContext(context),
    id,
  );
  sendSuccess(res, { job });
}

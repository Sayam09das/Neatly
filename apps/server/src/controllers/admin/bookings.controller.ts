import type { IncomingMessage, ServerResponse } from "node:http";
import { HTTP_STATUS } from "../../config/constants.ts";
import { actorFromContext } from "../../lib/domain/http-actor.ts";
import { getDomainServices } from "../../lib/domain/runtime.ts";
import { sendSuccess } from "../../lib/http.ts";
import {
  getValidatedBody,
  getValidatedParams,
  getValidatedQuery,
  type RequestContext,
} from "../../lib/request-context.ts";
import type {
  AssignCleanerBody,
  BookingListQueryInput,
  BookingStatusBody,
  CreateBookingBody,
  UpdateBookingBody,
} from "../../lib/validations/admin.schema.ts";

export async function listBookingsController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const result = await getDomainServices().bookings.list(
    actorFromContext(context),
    getValidatedQuery<BookingListQueryInput>(context),
  );
  sendSuccess(res, result);
}

export async function getBookingController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const { id } = getValidatedParams<{ id: string }>(context);
  const booking = await getDomainServices().bookings.getById(
    actorFromContext(context),
    id,
  );
  sendSuccess(res, { booking });
}

export async function createBookingController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const booking = await getDomainServices().bookings.create(
    actorFromContext(context),
    getValidatedBody<CreateBookingBody>(context),
  );
  sendSuccess(res, { booking }, { statusCode: HTTP_STATUS.CREATED });
}

export async function updateBookingController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const { id } = getValidatedParams<{ id: string }>(context);
  const booking = await getDomainServices().bookings.update(
    actorFromContext(context),
    id,
    getValidatedBody<UpdateBookingBody>(context),
  );
  sendSuccess(res, { booking });
}

export async function changeBookingStatusController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const { id } = getValidatedParams<{ id: string }>(context);
  const { status } = getValidatedBody<BookingStatusBody>(context);
  const booking = await getDomainServices().bookings.changeStatus(
    actorFromContext(context),
    id,
    status,
  );
  sendSuccess(res, { booking });
}

export async function assignBookingCleanerController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const { id } = getValidatedParams<{ id: string }>(context);
  const { cleanerId } = getValidatedBody<AssignCleanerBody>(context);
  const booking = await getDomainServices().bookings.assignCleaner(
    actorFromContext(context),
    id,
    cleanerId,
  );
  sendSuccess(res, { booking });
}

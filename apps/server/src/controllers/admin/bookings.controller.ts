import type { IncomingMessage, ServerResponse } from "node:http";
import { HTTP_STATUS } from "../../config/constants.ts";
import { actorFromContext } from "../../lib/domain/http-actor.ts";
import { getDomainServices } from "../../lib/domain/runtime.ts";
import {
  ADMIN_APP_HREFS,
  ADMIN_EVENT_COPY,
} from "../../lib/events/admin-event-copy.ts";
import { publishAdminDomainEvent } from "../../lib/events/publisher.ts";
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
  const actor = actorFromContext(context);
  const booking = await getDomainServices().bookings.create(
    actor,
    getValidatedBody<CreateBookingBody>(context),
  );
  sendSuccess(res, { booking }, { statusCode: HTTP_STATUS.CREATED });
  await publishAdminDomainEvent(actor, {
    entityId: booking.id,
    message: ADMIN_EVENT_COPY.bookingCreated.message,
    relatedHref: ADMIN_APP_HREFS.bookings,
    relatedLabel: ADMIN_EVENT_COPY.bookingCreated.relatedLabel,
    title: ADMIN_EVENT_COPY.bookingCreated.title,
    type: "BOOKING_CREATED",
  });
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
  const actor = actorFromContext(context);
  const booking = await getDomainServices().bookings.changeStatus(
    actor,
    id,
    status,
  );
  sendSuccess(res, { booking });
  const copy =
    status === "CANCELLED"
      ? ADMIN_EVENT_COPY.bookingCancelled
      : ADMIN_EVENT_COPY.bookingStatusChanged;
  await publishAdminDomainEvent(actor, {
    entityId: booking.id,
    message: copy.message,
    relatedHref: ADMIN_APP_HREFS.bookings,
    relatedLabel: copy.relatedLabel,
    title: copy.title,
    type:
      status === "CANCELLED" ? "BOOKING_CANCELLED" : "BOOKING_STATUS_CHANGED",
  });
}

export async function assignBookingCleanerController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const { id } = getValidatedParams<{ id: string }>(context);
  const { cleanerId } = getValidatedBody<AssignCleanerBody>(context);
  const actor = actorFromContext(context);
  const booking = await getDomainServices().bookings.assignCleaner(
    actor,
    id,
    cleanerId,
  );
  sendSuccess(res, { booking });
  await publishAdminDomainEvent(actor, {
    entityId: booking.id,
    message: ADMIN_EVENT_COPY.bookingAssigned.message,
    relatedHref: ADMIN_APP_HREFS.bookings,
    relatedLabel: ADMIN_EVENT_COPY.bookingAssigned.relatedLabel,
    title: ADMIN_EVENT_COPY.bookingAssigned.title,
    type: "BOOKING_ASSIGNED",
  });
}

import type { IncomingMessage, ServerResponse } from "node:http";
import { HTTP_STATUS } from "../../config/constants.ts";
import {
  customerActorFromContext,
  sessionCustomerIdentityFromContext,
} from "../../lib/domain/http-actor.ts";
import { getDomainServices } from "../../lib/domain/runtime.ts";
import {
  ADMIN_APP_HREFS,
  ADMIN_EVENT_COPY,
} from "../../lib/events/admin-event-copy.ts";
import {
  CUSTOMER_APP_HREFS,
  CUSTOMER_EVENT_COPY,
} from "../../lib/events/customer-event-copy.ts";
import {
  publishAdminDomainEvent,
  recordCustomerInboxNotification,
} from "../../lib/events/publisher.ts";
import { sendSuccess } from "../../lib/http.ts";
import {
  getValidatedBody,
  getValidatedParams,
  getValidatedQuery,
  type RequestContext,
} from "../../lib/request-context.ts";
import type {
  CreateCustomerBookingBody,
  CustomerBookingListQueryInput,
  UpdateCustomerBookingBody,
} from "../../lib/validations/customer-booking.schema.ts";

export async function createCustomerBookingController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const actor = customerActorFromContext(context);
  const booking = await getDomainServices().bookings.createForCustomer(
    actor,
    sessionCustomerIdentityFromContext(context),
    getValidatedBody<CreateCustomerBookingBody>(context),
  );
  sendSuccess(res, { booking }, { statusCode: HTTP_STATUS.CREATED });
  await recordCustomerInboxNotification(actor.id, {
    entityId: booking.id,
    message: CUSTOMER_EVENT_COPY.bookingCreated.message,
    relatedHref: CUSTOMER_APP_HREFS.booking(booking.id),
    relatedLabel: CUSTOMER_EVENT_COPY.bookingCreated.relatedLabel,
    title: CUSTOMER_EVENT_COPY.bookingCreated.title,
    type: "BOOKING_CREATED",
  });
  await publishAdminDomainEvent(actor, {
    entityId: booking.id,
    message: ADMIN_EVENT_COPY.bookingCreated.message,
    relatedHref: ADMIN_APP_HREFS.bookings,
    relatedLabel: ADMIN_EVENT_COPY.bookingCreated.relatedLabel,
    title: ADMIN_EVENT_COPY.bookingCreated.title,
    type: "BOOKING_CREATED",
  });
}

export async function listCustomerBookingsController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const result = await getDomainServices().bookings.listForCustomer(
    customerActorFromContext(context),
    sessionCustomerIdentityFromContext(context),
    getValidatedQuery<CustomerBookingListQueryInput>(context),
  );
  sendSuccess(res, {
    items: result.items,
    pagination: result.pagination,
  });
}

export async function getCustomerOverviewController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const overview = await getDomainServices().bookings.getCustomerOverview(
    customerActorFromContext(context),
    sessionCustomerIdentityFromContext(context),
  );
  sendSuccess(res, { overview });
}

export async function getCustomerBookingController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const { id } = getValidatedParams<{ id: string }>(context);
  const booking = await getDomainServices().bookings.getCustomerBooking(
    customerActorFromContext(context),
    sessionCustomerIdentityFromContext(context),
    id,
  );
  sendSuccess(res, { booking });
}

export async function updateCustomerBookingController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const { id } = getValidatedParams<{ id: string }>(context);
  const actor = customerActorFromContext(context);
  const booking = await getDomainServices().bookings.updateForCustomer(
    actor,
    sessionCustomerIdentityFromContext(context),
    id,
    getValidatedBody<UpdateCustomerBookingBody>(context),
  );
  sendSuccess(res, { booking });
  await recordCustomerInboxNotification(actor.id, {
    entityId: booking.id,
    message: CUSTOMER_EVENT_COPY.bookingUpdated.message,
    relatedHref: CUSTOMER_APP_HREFS.booking(booking.id),
    relatedLabel: CUSTOMER_EVENT_COPY.bookingUpdated.relatedLabel,
    title: CUSTOMER_EVENT_COPY.bookingUpdated.title,
    type: "BOOKING_UPDATED",
  });
}

export async function cancelCustomerBookingController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const { id } = getValidatedParams<{ id: string }>(context);
  const actor = customerActorFromContext(context);
  const booking = await getDomainServices().bookings.cancelForCustomer(
    actor,
    sessionCustomerIdentityFromContext(context),
    id,
  );
  sendSuccess(res, { booking });
  await recordCustomerInboxNotification(actor.id, {
    entityId: booking.id,
    message: CUSTOMER_EVENT_COPY.bookingCancelled.message,
    relatedHref: CUSTOMER_APP_HREFS.booking(booking.id),
    relatedLabel: CUSTOMER_EVENT_COPY.bookingCancelled.relatedLabel,
    title: CUSTOMER_EVENT_COPY.bookingCancelled.title,
    type: "BOOKING_CANCELLED",
  });
  await publishAdminDomainEvent(actor, {
    entityId: booking.id,
    message: ADMIN_EVENT_COPY.bookingCancelled.message,
    relatedHref: ADMIN_APP_HREFS.bookings,
    relatedLabel: ADMIN_EVENT_COPY.bookingCancelled.relatedLabel,
    title: ADMIN_EVENT_COPY.bookingCancelled.title,
    type: "BOOKING_CANCELLED",
  });
}

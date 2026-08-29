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
import { publishAdminDomainEvent } from "../../lib/events/publisher.ts";
import { sendSuccess } from "../../lib/http.ts";
import {
  getValidatedBody,
  getValidatedParams,
  type RequestContext,
} from "../../lib/request-context.ts";
import type { CreateCustomerBookingBody } from "../../lib/validations/customer-booking.schema.ts";

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
  await publishAdminDomainEvent(actor, {
    entityId: booking.id,
    message: ADMIN_EVENT_COPY.bookingCreated.message,
    relatedHref: ADMIN_APP_HREFS.bookings,
    relatedLabel: ADMIN_EVENT_COPY.bookingCreated.relatedLabel,
    title: ADMIN_EVENT_COPY.bookingCreated.title,
    type: "BOOKING_CREATED",
  });
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

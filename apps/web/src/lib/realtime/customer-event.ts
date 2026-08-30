import { z } from "@neatly/config/zod";
import { createEventIdDedupe } from "@/lib/realtime/admin-event";

export const CUSTOMER_REALTIME_EVENT_TYPES = [
  "BOOKING_ASSIGNED",
  "BOOKING_CANCELLED",
  "BOOKING_CREATED",
  "BOOKING_STATUS_CHANGED",
  "BOOKING_UPDATED",
  "QUOTE_READY",
  "REVIEW_CREATED",
] as const;

export type CustomerRealtimeEventType =
  (typeof CUSTOMER_REALTIME_EVENT_TYPES)[number];

const customerRealtimeEventSchema = z.object({
  entityId: z.string().min(1),
  eventId: z.string().min(1),
  message: z.string().min(1),
  notificationId: z.string().min(1).nullable(),
  relatedHref: z.string().min(1).nullable(),
  timestamp: z.string().min(1),
  title: z.string().min(1),
  type: z.enum(CUSTOMER_REALTIME_EVENT_TYPES),
});

export type CustomerRealtimeEvent = z.infer<typeof customerRealtimeEventSchema>;

export function parseCustomerRealtimeEvent(
  value: unknown,
): CustomerRealtimeEvent | null {
  const parsed = customerRealtimeEventSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

export function shouldToastCustomerEvent(
  event: CustomerRealtimeEvent,
): boolean {
  return event.notificationId !== null;
}

export { createEventIdDedupe };

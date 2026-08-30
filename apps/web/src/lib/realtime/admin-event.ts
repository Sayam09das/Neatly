import { z } from "@neatly/config/zod";

export const ADMIN_REALTIME_EVENT_TYPES = [
  "BOOKING_ASSIGNED",
  "BOOKING_CANCELLED",
  "BOOKING_CREATED",
  "BOOKING_STATUS_CHANGED",
  "CLEANER_CREATED",
  "CLEANER_STATUS_CHANGED",
  "CLEANER_UPDATED",
  "CUSTOMER_CREATED",
  "CUSTOMER_UPDATED",
  "NOTIFICATION_CREATED",
  "QUOTE_ACCEPTED",
  "QUOTE_QUOTED",
  "REVIEW_MODERATED",
  "SERVICE_CREATED",
  "SERVICE_STATUS_CHANGED",
  "SERVICE_UPDATED",
] as const;

export type AdminRealtimeEventType =
  (typeof ADMIN_REALTIME_EVENT_TYPES)[number];

export const ADMIN_TOAST_EVENT_TYPES = new Set<AdminRealtimeEventType>([
  "BOOKING_ASSIGNED",
  "BOOKING_CANCELLED",
  "BOOKING_CREATED",
  "BOOKING_STATUS_CHANGED",
  "CLEANER_CREATED",
  "CLEANER_STATUS_CHANGED",
  "CUSTOMER_CREATED",
  "NOTIFICATION_CREATED",
  "QUOTE_ACCEPTED",
  "QUOTE_QUOTED",
  "REVIEW_MODERATED",
  "SERVICE_CREATED",
  "SERVICE_STATUS_CHANGED",
]);

const adminRealtimeEventSchema = z.object({
  actorId: z.string().min(1),
  entityId: z.string().min(1),
  eventId: z.string().min(1),
  message: z.string().min(1),
  notificationId: z.string().min(1).nullable(),
  relatedHref: z.string().min(1).nullable(),
  timestamp: z.string().min(1),
  title: z.string().min(1),
  type: z.enum(ADMIN_REALTIME_EVENT_TYPES),
});

export type AdminRealtimeEvent = z.infer<typeof adminRealtimeEventSchema>;

export function parseAdminRealtimeEvent(
  value: unknown,
): AdminRealtimeEvent | null {
  const parsed = adminRealtimeEventSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

export function shouldToastAdminEvent(event: AdminRealtimeEvent): boolean {
  return (
    event.notificationId !== null && ADMIN_TOAST_EVENT_TYPES.has(event.type)
  );
}

export function createEventIdDedupe(limit = 50): {
  take: (eventId: string) => boolean;
} {
  const seen = new Set<string>();
  const order: string[] = [];

  return {
    take: (eventId: string): boolean => {
      if (seen.has(eventId)) {
        return false;
      }

      seen.add(eventId);
      order.push(eventId);

      if (order.length > limit) {
        const oldest = order.shift();

        if (oldest !== undefined) {
          seen.delete(oldest);
        }
      }

      return true;
    },
  };
}

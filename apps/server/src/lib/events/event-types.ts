export const ADMIN_DOMAIN_EVENT_TYPES = [
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
  "REVIEW_MODERATED",
  "SERVICE_CREATED",
  "SERVICE_STATUS_CHANGED",
  "SERVICE_UPDATED",
] as const;

export type AdminDomainEventType = (typeof ADMIN_DOMAIN_EVENT_TYPES)[number];

export interface AdminDomainEvent {
  actorId: string;
  entityId: string;
  eventId: string;
  message: string;
  notificationId: string | null;
  relatedHref: string | null;
  timestamp: string;
  title: string;
  type: AdminDomainEventType;
}

export interface AdminDomainEventInput {
  actorId: string;
  entityId: string;
  message: string;
  relatedHref: string | null;
  relatedLabel: string | null;
  title: string;
  type: AdminDomainEventType;
}

export const CUSTOMER_REALTIME_EVENT_TYPES = [
  "BOOKING_ASSIGNED",
  "BOOKING_CANCELLED",
  "BOOKING_CREATED",
  "BOOKING_STATUS_CHANGED",
  "BOOKING_UPDATED",
  "REVIEW_CREATED",
] as const;

export type CustomerRealtimeEventType =
  (typeof CUSTOMER_REALTIME_EVENT_TYPES)[number];

export interface CustomerRealtimeEvent {
  entityId: string;
  eventId: string;
  message: string;
  notificationId: string | null;
  relatedHref: string | null;
  timestamp: string;
  title: string;
  type: CustomerRealtimeEventType;
}

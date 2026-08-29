import type { AdminRealtimeEventType } from "@/lib/realtime/admin-event";

export const ADMIN_REFRESH_KEYS = [
  "bookings",
  "customers",
  "dashboard",
  "notifications",
  "reviews",
  "services",
] as const;

export type AdminRefreshKey = (typeof ADMIN_REFRESH_KEYS)[number];

const listeners = new Map<AdminRefreshKey, Set<() => void>>();

export function subscribeAdminRefresh(
  key: AdminRefreshKey,
  listener: () => void,
): () => void {
  const set = listeners.get(key) ?? new Set<() => void>();
  set.add(listener);
  listeners.set(key, set);

  return (): void => {
    set.delete(listener);

    if (set.size === 0) {
      listeners.delete(key);
    }
  };
}

export function publishAdminRefresh(keys: readonly AdminRefreshKey[]): void {
  const unique = new Set(keys);

  for (const key of unique) {
    const set = listeners.get(key);

    if (set === undefined) {
      continue;
    }

    for (const listener of set) {
      listener();
    }
  }
}

export function refreshKeysForAdminEvent(
  type: AdminRealtimeEventType,
): readonly AdminRefreshKey[] {
  switch (type) {
    case "BOOKING_ASSIGNED":
    case "BOOKING_CANCELLED":
    case "BOOKING_CREATED":
    case "BOOKING_STATUS_CHANGED":
      return ["bookings", "dashboard", "notifications"];
    case "CUSTOMER_CREATED":
    case "CUSTOMER_UPDATED":
      return ["customers", "dashboard", "notifications"];
    case "CLEANER_CREATED":
    case "CLEANER_STATUS_CHANGED":
    case "CLEANER_UPDATED":
      return ["dashboard", "notifications"];
    case "SERVICE_CREATED":
    case "SERVICE_STATUS_CHANGED":
    case "SERVICE_UPDATED":
      return ["services", "notifications"];
    case "REVIEW_MODERATED":
      return ["reviews", "notifications"];
    case "NOTIFICATION_CREATED":
      return ["notifications"];
  }
}

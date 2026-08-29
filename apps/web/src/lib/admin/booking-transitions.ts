import type { AdminBookingStatus } from "@/types/admin-booking";

export const ADMIN_BOOKING_STATUS_TRANSITIONS: Record<
  AdminBookingStatus,
  readonly AdminBookingStatus[]
> = {
  ASSIGNED: ["IN_PROGRESS", "CANCELLED"],
  CANCELLED: [],
  COMPLETED: [],
  CONFIRMED: ["ASSIGNED", "CANCELLED"],
  IN_PROGRESS: ["COMPLETED", "CANCELLED"],
  PENDING: ["CONFIRMED", "ASSIGNED", "CANCELLED"],
};

export function getAdminBookingStatusOptions(
  current: AdminBookingStatus,
): readonly AdminBookingStatus[] {
  return ADMIN_BOOKING_STATUS_TRANSITIONS[current];
}

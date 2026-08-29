import type { BookingStatus } from "@prisma/client";
import { invalidBookingTransition } from "../../lib/domain/errors.ts";

export const BOOKING_STATUS_TRANSITIONS: Record<
  BookingStatus,
  readonly BookingStatus[]
> = {
  ASSIGNED: ["IN_PROGRESS", "CANCELLED"],
  CANCELLED: [],
  COMPLETED: [],
  CONFIRMED: ["ASSIGNED", "CANCELLED"],
  IN_PROGRESS: ["COMPLETED", "CANCELLED"],
  PENDING: ["CONFIRMED", "ASSIGNED", "CANCELLED"],
};

export function canTransitionBookingStatus(
  from: BookingStatus,
  to: BookingStatus,
): boolean {
  return BOOKING_STATUS_TRANSITIONS[from].includes(to);
}

export function assertBookingTransition(
  from: BookingStatus,
  to: BookingStatus,
): void {
  if (!canTransitionBookingStatus(from, to)) {
    throw invalidBookingTransition();
  }
}

export function customerMayCancelBooking(status: BookingStatus): boolean {
  return canTransitionBookingStatus(status, "CANCELLED");
}

export function customerMayUpdateBooking(status: BookingStatus): boolean {
  return status !== "COMPLETED" && status !== "CANCELLED";
}

export function cleanerMayStartJob(status: BookingStatus): boolean {
  return canTransitionBookingStatus(status, "IN_PROGRESS");
}

export function cleanerMayCompleteJob(status: BookingStatus): boolean {
  return canTransitionBookingStatus(status, "COMPLETED");
}

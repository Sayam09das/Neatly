import { describe, expect, it } from "vitest";
import { ConflictError } from "../../../apps/server/src/lib/errors.ts";
import {
  assertBookingTransition,
  canTransitionBookingStatus,
} from "../../../apps/server/src/services/bookings/booking-transitions.ts";

describe("booking status transitions", (): void => {
  it("allows the documented happy path and cancellation", (): void => {
    expect(canTransitionBookingStatus("PENDING", "CONFIRMED")).toBe(true);
    expect(canTransitionBookingStatus("CONFIRMED", "ASSIGNED")).toBe(true);
    expect(canTransitionBookingStatus("ASSIGNED", "IN_PROGRESS")).toBe(true);
    expect(canTransitionBookingStatus("IN_PROGRESS", "COMPLETED")).toBe(true);
    expect(canTransitionBookingStatus("PENDING", "CANCELLED")).toBe(true);
    expect(canTransitionBookingStatus("IN_PROGRESS", "CANCELLED")).toBe(true);
  });

  it("rejects completed or cancelled reversals", (): void => {
    expect(canTransitionBookingStatus("COMPLETED", "PENDING")).toBe(false);
    expect(canTransitionBookingStatus("COMPLETED", "CANCELLED")).toBe(false);
    expect(canTransitionBookingStatus("CANCELLED", "PENDING")).toBe(false);
    expect((): void => {
      assertBookingTransition("COMPLETED", "PENDING");
    }).toThrow(ConflictError);
  });
});

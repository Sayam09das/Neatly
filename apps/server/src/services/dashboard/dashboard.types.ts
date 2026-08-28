import type { BookingRecord } from "../bookings/booking.types.ts";

export interface DashboardCounts {
  active: number;
  total: number;
}

export interface DashboardMetrics {
  bookings: {
    assigned: number;
    cancelled: number;
    completed: number;
    confirmed: number;
    inProgress: number;
    pending: number;
    total: number;
  };
  cleaners: DashboardCounts;
  customers: DashboardCounts;
  recentBookings: readonly BookingRecord[];
  reviews: DashboardCounts;
  services: DashboardCounts;
}

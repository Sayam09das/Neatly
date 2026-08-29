import type { BookingStatus } from "@prisma/client";
import type { PaginationQuery, SortQuery } from "../../lib/query.ts";
import {
  customerMayCancelBooking,
  customerMayUpdateBooking,
} from "./booking-transitions.ts";

export const BOOKING_SORT_FIELDS = [
  "createdAt",
  "scheduledAt",
  "status",
] as const;

export interface BookingParty {
  id: string;
  name: string;
}

export interface BookingRecord {
  cleaner: BookingParty | null;
  cleanerId: string | null;
  createdAt: Date;
  customer: BookingParty | null;
  customerId: string | null;
  id: string;
  notes: string | null;
  quoteRequestId: string | null;
  scheduledAt: Date | null;
  service: BookingParty | null;
  serviceAddress: string | null;
  serviceId: string | null;
  status: BookingStatus;
  updatedAt: Date;
}

export interface CreateBookingInput {
  cleanerId?: string | null;
  customerId: string;
  notes?: string | null;
  quoteRequestId?: string | null;
  scheduledAt?: Date | null;
  serviceAddress?: string | null;
  serviceId: string;
}

export interface CreateCustomerBookingInput {
  notes?: string | null;
  quoteRequestId?: string | null;
  scheduledAt: Date;
  serviceAddress: string;
  serviceId: string;
}

export interface CustomerBookingActions {
  canCancel: boolean;
  canUpdate: boolean;
}

export interface CustomerBookingView {
  actions: CustomerBookingActions;
  id: string;
  linkedToQuote: boolean;
  notes: string | null;
  scheduledAt: string | null;
  service: BookingParty | null;
  serviceAddress: string | null;
  status: BookingStatus;
}

export function toCustomerBookingView(
  record: BookingRecord,
): CustomerBookingView {
  return {
    actions: {
      canCancel: customerMayCancelBooking(record.status),
      canUpdate: customerMayUpdateBooking(record.status),
    },
    id: record.id,
    linkedToQuote: record.quoteRequestId !== null,
    notes: record.notes,
    scheduledAt:
      record.scheduledAt === null ? null : record.scheduledAt.toISOString(),
    service: record.service,
    serviceAddress: record.serviceAddress,
    status: record.status,
  };
}

export interface UpdateBookingInput {
  notes?: string | null;
  scheduledAt?: Date | null;
  serviceAddress?: string | null;
}

export const CUSTOMER_BOOKING_WINDOWS = ["upcoming", "past"] as const;
export const CUSTOMER_OVERVIEW_RECENT_LIMIT = 5;
export const CUSTOMER_UPCOMING_EXCLUDED_STATUSES = [
  "CANCELLED",
  "COMPLETED",
] as const;

export type CustomerBookingWindow = (typeof CUSTOMER_BOOKING_WINDOWS)[number];

export interface BookingListQuery {
  cleanerId?: string;
  customerId?: string;
  excludeStatuses?: readonly BookingStatus[];
  pagination?: PaginationQuery;
  scheduledFrom?: Date;
  scheduledTo?: Date;
  search?: string;
  serviceId?: string;
  sort?: SortQuery;
  status?: BookingStatus;
}

export interface CustomerBookingListQuery {
  pagination?: PaginationQuery;
  search?: string;
  status?: BookingStatus;
  window?: CustomerBookingWindow;
}

export interface CustomerBookingSummaryCounts {
  completed: number;
  pending: number;
  total: number;
  upcoming: number;
}

export interface CustomerOverview {
  recentBookings: CustomerBookingView[];
  summary: CustomerBookingSummaryCounts;
  upcomingBooking: CustomerBookingView | null;
}

export interface BookingStatusCounts {
  assigned: number;
  cancelled: number;
  completed: number;
  confirmed: number;
  inProgress: number;
  pending: number;
  total: number;
}

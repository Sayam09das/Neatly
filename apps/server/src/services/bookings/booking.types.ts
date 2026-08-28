import type { BookingStatus } from "@prisma/client";
import type { PaginationQuery, SortQuery } from "../../lib/query.ts";

export const BOOKING_SORT_FIELDS = [
  "createdAt",
  "scheduledAt",
  "status",
] as const;

export interface BookingRecord {
  cleanerId: string | null;
  createdAt: Date;
  customerId: string | null;
  id: string;
  notes: string | null;
  quoteRequestId: string | null;
  scheduledAt: Date | null;
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

export interface UpdateBookingInput {
  notes?: string | null;
  scheduledAt?: Date | null;
  serviceAddress?: string | null;
}

export interface BookingListQuery {
  cleanerId?: string;
  customerId?: string;
  pagination?: PaginationQuery;
  search?: string;
  sort?: SortQuery;
  status?: BookingStatus;
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

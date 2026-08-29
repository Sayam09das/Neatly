import type { CleanerStatus } from "@prisma/client";
import type { PaginationQuery, SortQuery } from "../../lib/query.ts";

export const CLEANER_SORT_FIELDS = [
  "createdAt",
  "email",
  "name",
  "status",
] as const;

export const CLEANER_WEEKDAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export type CleanerWeekday = (typeof CLEANER_WEEKDAYS)[number];

export interface CleanerWeekDayAvailability {
  available: boolean;
  day: CleanerWeekday;
  end: string | null;
  start: string | null;
}

export interface CleanerAvailabilityConflict {
  date: string;
  jobId: string;
  serviceName: string | null;
}

export interface CleanerAvailabilityView {
  conflicts: CleanerAvailabilityConflict[];
  week: CleanerWeekDayAvailability[];
}

export interface CleanerRecord {
  availability: unknown | null;
  createdAt: Date;
  email: string | null;
  id: string;
  name: string;
  phone: string | null;
  status: CleanerStatus;
  updatedAt: Date;
  userId: string | null;
}

export interface CreateCleanerInput {
  email?: string | null;
  name: string;
  phone?: string | null;
  userId?: string | null;
}

export interface UpdateCleanerInput {
  availability?: unknown | null;
  email?: string | null;
  name?: string;
  phone?: string | null;
}

export interface CleanerListQuery {
  pagination?: PaginationQuery;
  search?: string;
  sort?: SortQuery;
  status?: CleanerStatus;
}

export interface CleanerStats {
  active: number;
  inactive: number;
  total: number;
}

export interface CleanerSessionView {
  email: string | null;
  id: string;
  name: string;
  phone: string | null;
  status: CleanerStatus;
}

export function toCleanerSessionView(
  record: CleanerRecord,
): CleanerSessionView {
  return {
    email: record.email,
    id: record.id,
    name: record.name,
    phone: record.phone,
    status: record.status,
  };
}

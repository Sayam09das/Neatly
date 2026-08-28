import type { CleanerStatus } from "@prisma/client";
import type { PaginationQuery, SortQuery } from "../../lib/query.ts";

export const CLEANER_SORT_FIELDS = [
  "createdAt",
  "email",
  "name",
  "status",
] as const;

export interface CleanerRecord {
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

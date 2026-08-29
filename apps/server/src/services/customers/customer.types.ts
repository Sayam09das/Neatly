import type { CustomerStatus } from "@prisma/client";
import type { PaginationQuery, SortQuery } from "../../lib/query.ts";

export const CUSTOMER_SORT_FIELDS = [
  "createdAt",
  "email",
  "name",
  "status",
] as const;

export interface CustomerRecord {
  address: string | null;
  avatarMediaId: string | null;
  bookingCount: number;
  createdAt: Date;
  email: string;
  id: string;
  name: string;
  phone: string | null;
  status: CustomerStatus;
  updatedAt: Date;
  userId: string | null;
}

export interface CreateCustomerInput {
  address?: string | null;
  avatarMediaId?: string | null;
  email: string;
  name: string;
  phone?: string | null;
  userId?: string | null;
}

export interface UpdateCustomerInput {
  address?: string | null;
  avatarMediaId?: string | null;
  email?: string;
  name?: string;
  phone?: string | null;
  userId?: string | null;
}

export interface CustomerListQuery {
  createdFrom?: Date;
  createdTo?: Date;
  pagination?: PaginationQuery;
  search?: string;
  sort?: SortQuery;
  status?: CustomerStatus;
}

export interface CustomerStats {
  active: number;
  inactive: number;
  total: number;
}

export interface CustomerProfileView {
  address: string | null;
  email: string;
  id: string;
  name: string;
  phone: string | null;
  status: CustomerStatus;
}

export interface UpdateCustomerProfileInput {
  address?: string | null;
  name?: string;
  phone?: string | null;
}

export function toCustomerProfileView(
  record: CustomerRecord,
): CustomerProfileView {
  return {
    address: record.address,
    email: record.email,
    id: record.id,
    name: record.name,
    phone: record.phone,
    status: record.status,
  };
}

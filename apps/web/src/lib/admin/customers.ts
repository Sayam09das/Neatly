import {
  ADMIN_API_PATHS,
  ADMIN_LIST_PAGE_SIZE,
  withAdminApiId,
} from "@/config/admin-api";
import { adminCustomerCopy } from "@/config/admin-customers";
import { mapAdminResult } from "@/lib/admin/parse-result";
import {
  isRecord,
  mapAdminPagination,
  readIsoDate,
  readNullableString,
  readNumber,
  readString,
  withAdminQuery,
} from "@/lib/admin/query";
import { type AdminApiResult, adminRequest } from "@/lib/api/admin-request";
import type {
  AdminCustomer,
  AdminCustomerFilters,
  AdminCustomerPagination,
} from "@/types/admin-customer";

const DATE_ONLY_PATTERN = /^(\d{4}-\d{2}-\d{2})/;
const WHITESPACE_PATTERN = /\s+/;

export function hasActiveCustomerFilters(
  filters: AdminCustomerFilters,
): boolean {
  return (
    filters.query.trim() !== "" ||
    filters.status !== "" ||
    filters.joinedFrom !== "" ||
    filters.joinedTo !== ""
  );
}

export function filterCustomers(
  customers: readonly AdminCustomer[],
  filters: AdminCustomerFilters,
): readonly AdminCustomer[] {
  const query = filters.query.trim().toLowerCase();

  return customers.filter((customer): boolean => {
    if (filters.status !== "" && customer.statusLabel !== filters.status) {
      return false;
    }

    if (!matchesJoinedRange(customer.joinedAt, filters)) {
      return false;
    }

    if (query === "") {
      return true;
    }

    const haystack = [
      customer.id,
      customer.name ?? "",
      customer.email ?? "",
      customer.phone ?? "",
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
}

export function formatCustomerJoinedDate(isoDateTime: string | null): string {
  if (isoDateTime === null || isoDateTime === "") {
    return adminCustomerCopy.emptyValue;
  }

  const date = new Date(isoDateTime);

  if (Number.isNaN(date.getTime())) {
    return adminCustomerCopy.emptyValue;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  }).format(date);
}

export function formatCustomerDateInput(isoDate: string): string {
  if (isoDate === "") {
    return "";
  }

  const date = new Date(`${isoDate}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  }).format(date);
}

export function formatCustomerJoinedFilterChip(
  filters: AdminCustomerFilters,
): string | null {
  if (filters.joinedFrom === "" && filters.joinedTo === "") {
    return null;
  }

  if (filters.joinedFrom !== "" && filters.joinedTo !== "") {
    return `${formatCustomerDateInput(filters.joinedFrom)} – ${formatCustomerDateInput(filters.joinedTo)}`;
  }

  if (filters.joinedFrom !== "") {
    return formatCustomerDateInput(filters.joinedFrom);
  }

  return formatCustomerDateInput(filters.joinedTo);
}

export function getCustomerNameLabel(name: string | null): string {
  if (name === null || name.trim() === "") {
    return adminCustomerCopy.emptyValue;
  }

  return name;
}

export function getCustomerContactLabel(
  email: string | null,
  phone: string | null,
): string {
  const parts = [email, phone].filter((value): value is string => {
    return value !== null && value.trim() !== "";
  });

  if (parts.length === 0) {
    return adminCustomerCopy.emptyValue;
  }

  return parts.join(" · ");
}

export function getCustomerBookingCountLabel(
  bookingCount: number | null,
): string {
  if (bookingCount === null) {
    return adminCustomerCopy.emptyValue;
  }

  return String(bookingCount);
}

export function getCustomerStatusLabel(statusLabel: string | null): string {
  if (statusLabel === null || statusLabel.trim() === "") {
    return adminCustomerCopy.emptyValue;
  }

  return statusLabel;
}

export function getCustomerInitials(name: string | null): string | null {
  if (name === null) {
    return null;
  }

  const parts = name.trim().split(WHITESPACE_PATTERN).filter(Boolean);
  const first = parts[0];

  if (first === undefined) {
    return null;
  }

  if (parts.length === 1) {
    return first.slice(0, 2).toUpperCase();
  }

  const last = parts[parts.length - 1];

  if (last === undefined) {
    return null;
  }

  return `${first.slice(0, 1)}${last.slice(0, 1)}`.toUpperCase();
}

export function shouldRenderCustomerPagination(
  pagination: AdminCustomerPagination | undefined,
  visibleCount: number,
): boolean {
  return (
    pagination !== undefined &&
    pagination.total > 0 &&
    pagination.totalPages > 1 &&
    visibleCount > 0
  );
}

function matchesJoinedRange(
  joinedAt: string | null,
  filters: AdminCustomerFilters,
): boolean {
  if (filters.joinedFrom === "" && filters.joinedTo === "") {
    return true;
  }

  if (joinedAt === null) {
    return false;
  }

  const joinedDate = extractDateOnly(joinedAt);

  if (joinedDate === null) {
    return false;
  }

  if (filters.joinedFrom !== "" && joinedDate < filters.joinedFrom) {
    return false;
  }

  if (filters.joinedTo !== "" && joinedDate > filters.joinedTo) {
    return false;
  }

  return true;
}

export interface AdminCustomerList {
  customers: readonly AdminCustomer[];
  pagination: AdminCustomerPagination;
}

export interface AdminCustomerListQuery extends AdminCustomerFilters {
  page: number;
}

export async function listAdminCustomers(
  query: AdminCustomerListQuery,
  init: RequestInit = {},
): Promise<AdminApiResult<AdminCustomerList>> {
  const result = await adminRequest<unknown>(
    withAdminQuery(ADMIN_API_PATHS.customers, {
      filters: {
        createdFrom: query.joinedFrom,
        createdTo: query.joinedTo,
        status: query.status,
      },
      limit: ADMIN_LIST_PAGE_SIZE,
      page: query.page,
      search: query.query,
    }),
    init,
  );
  return mapAdminResult(result, mapCustomerList);
}

export async function getAdminCustomer(
  id: string,
  init: RequestInit = {},
): Promise<AdminApiResult<AdminCustomer>> {
  const result = await adminRequest<unknown>(
    withAdminApiId(ADMIN_API_PATHS.customer, id),
    init,
  );
  return mapAdminResult(result, (value) => {
    if (!isRecord(value)) {
      return null;
    }

    return mapCustomer(value.customer ?? value);
  });
}

function mapCustomerList(value: unknown): AdminCustomerList | null {
  if (!isRecord(value) || !Array.isArray(value.items)) {
    return null;
  }

  const pagination = mapAdminPagination(value.pagination, ADMIN_LIST_PAGE_SIZE);

  if (pagination === null) {
    return null;
  }

  const customers: AdminCustomer[] = [];

  for (const item of value.items) {
    const customer = mapCustomer(item);

    if (customer === null) {
      return null;
    }

    customers.push(customer);
  }

  return { customers, pagination };
}

function mapCustomer(value: unknown): AdminCustomer | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = readString(value.id);

  if (id === null) {
    return null;
  }

  return {
    avatarUrl: null,
    bookingCount: readNumber(value.bookingCount),
    email: readNullableString(value.email),
    id,
    joinedAt: readIsoDate(value.createdAt),
    name: readNullableString(value.name),
    phone: readNullableString(value.phone),
    statusLabel: mapCustomerStatusLabel(readNullableString(value.status)),
  };
}

function mapCustomerStatusLabel(status: string | null): string | null {
  if (status === "ACTIVE") {
    return "Active";
  }

  if (status === "INACTIVE") {
    return "Inactive";
  }

  return status;
}

function extractDateOnly(value: string): string | null {
  const match = DATE_ONLY_PATTERN.exec(value);

  if (match === null) {
    return null;
  }

  const date = match[1];

  return date === undefined ? null : date;
}

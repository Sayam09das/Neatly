import {
  ADMIN_API_PATHS,
  ADMIN_FILTER_CATALOG_LIMIT,
  ADMIN_LIST_PAGE_SIZE,
  withAdminApiId,
} from "@/config/admin-api";
import {
  adminBookingCopy,
  adminBookingStatusLabels,
} from "@/config/admin-bookings";
import { emptyToNull } from "@/lib/admin/mutation-input";
import { mapAdminResult } from "@/lib/admin/parse-result";
import {
  isRecord,
  mapAdminPagination,
  readIsoDate,
  readNullableString,
  readString,
  withAdminQuery,
} from "@/lib/admin/query";
import { type AdminApiResult, adminRequest } from "@/lib/api/admin-request";
import type {
  AdminBooking,
  AdminBookingFilterCatalog,
  AdminBookingFilterOption,
  AdminBookingFilters,
  AdminBookingPagination,
  AdminBookingStatus,
  AdminBookingStatusFilter,
} from "@/types/admin-booking";
import {
  ADMIN_BOOKING_STATUS_ALL,
  adminBookingStatuses,
} from "@/types/admin-booking";

const DATE_ONLY_PATTERN = /^(\d{4}-\d{2}-\d{2})/;

export function hasActiveBookingFilters(filters: AdminBookingFilters): boolean {
  return (
    filters.query.trim() !== "" ||
    filters.status !== ADMIN_BOOKING_STATUS_ALL ||
    filters.scheduledFrom !== "" ||
    filters.scheduledTo !== "" ||
    filters.cleanerId !== "" ||
    filters.customerId !== "" ||
    filters.serviceId !== ""
  );
}

export function filterBookings(
  bookings: readonly AdminBooking[],
  filters: AdminBookingFilters,
): readonly AdminBooking[] {
  const query = filters.query.trim().toLowerCase();

  return bookings.filter((booking): boolean => {
    if (
      filters.status !== ADMIN_BOOKING_STATUS_ALL &&
      booking.status !== filters.status
    ) {
      return false;
    }

    if (filters.cleanerId !== "" && booking.cleanerId !== filters.cleanerId) {
      return false;
    }

    if (
      filters.customerId !== "" &&
      booking.customerId !== filters.customerId
    ) {
      return false;
    }

    if (filters.serviceId !== "" && booking.serviceId !== filters.serviceId) {
      return false;
    }

    if (!matchesScheduledRange(booking.scheduledAt, filters)) {
      return false;
    }

    if (query === "") {
      return true;
    }

    const haystack = [
      booking.id,
      booking.customerName ?? "",
      booking.serviceName ?? "",
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
}

export function formatBookingSchedule(isoDateTime: string | null): string {
  if (isoDateTime === null || isoDateTime === "") {
    return adminBookingCopy.emptyValue;
  }

  const date = new Date(isoDateTime);

  if (Number.isNaN(date.getTime())) {
    return adminBookingCopy.emptyValue;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function formatBookingDateInput(isoDate: string): string {
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

export function formatBookingDateFilterChip(
  filters: AdminBookingFilters,
): string | null {
  if (filters.scheduledFrom === "" && filters.scheduledTo === "") {
    return null;
  }

  if (filters.scheduledFrom !== "" && filters.scheduledTo !== "") {
    return `${formatBookingDateInput(filters.scheduledFrom)} – ${formatBookingDateInput(filters.scheduledTo)}`;
  }

  if (filters.scheduledFrom !== "") {
    return formatBookingDateInput(filters.scheduledFrom);
  }

  return formatBookingDateInput(filters.scheduledTo);
}

export function getBookingStatusLabel(
  status: AdminBookingStatusFilter,
): string {
  if (status === ADMIN_BOOKING_STATUS_ALL) {
    return adminBookingCopy.statusAll;
  }

  return adminBookingStatusLabels[status];
}

export function getBookingIdLabel(bookingId: string): string {
  if (bookingId.trim() === "") {
    return adminBookingCopy.emptyValue;
  }

  return bookingId;
}

export function getBookingCustomerLabel(customerName: string | null): string {
  if (customerName === null || customerName.trim() === "") {
    return adminBookingCopy.customerEmpty;
  }

  return customerName;
}

export function getBookingServiceLabel(serviceName: string | null): string {
  if (serviceName === null || serviceName.trim() === "") {
    return adminBookingCopy.emptyValue;
  }

  return serviceName;
}

export function getBookingCleanerLabel(cleanerName: string | null): string {
  if (cleanerName === null || cleanerName.trim() === "") {
    return adminBookingCopy.unassignedCleaner;
  }

  return cleanerName;
}

export function shouldRenderBookingPagination(
  pagination: AdminBookingPagination | undefined,
  visibleCount: number,
): boolean {
  return (
    pagination !== undefined &&
    pagination.total > 0 &&
    pagination.totalPages > 1 &&
    visibleCount > 0
  );
}

function matchesScheduledRange(
  scheduledAt: string | null,
  filters: AdminBookingFilters,
): boolean {
  if (filters.scheduledFrom === "" && filters.scheduledTo === "") {
    return true;
  }

  if (scheduledAt === null) {
    return false;
  }

  const bookingDate = extractDateOnly(scheduledAt);

  if (bookingDate === null) {
    return false;
  }

  if (filters.scheduledFrom !== "" && bookingDate < filters.scheduledFrom) {
    return false;
  }

  if (filters.scheduledTo !== "" && bookingDate > filters.scheduledTo) {
    return false;
  }

  return true;
}

export interface AdminBookingList {
  bookings: readonly AdminBooking[];
  pagination: AdminBookingPagination;
}

export interface AdminBookingListQuery extends AdminBookingFilters {
  page: number;
}

export async function listAdminBookings(
  query: AdminBookingListQuery,
  init: RequestInit = {},
): Promise<AdminApiResult<AdminBookingList>> {
  const result = await adminRequest<unknown>(
    withAdminQuery(ADMIN_API_PATHS.bookings, {
      filters: {
        cleanerId: query.cleanerId,
        customerId: query.customerId,
        scheduledFrom: query.scheduledFrom,
        scheduledTo: query.scheduledTo,
        serviceId: query.serviceId,
        status:
          query.status === ADMIN_BOOKING_STATUS_ALL ? undefined : query.status,
      },
      limit: ADMIN_LIST_PAGE_SIZE,
      page: query.page,
      search: query.query,
    }),
    init,
  );
  return mapAdminResult(result, mapBookingList);
}

export async function getAdminBooking(
  id: string,
  init: RequestInit = {},
): Promise<AdminApiResult<AdminBooking>> {
  const result = await adminRequest<unknown>(
    withAdminApiId(ADMIN_API_PATHS.booking, id),
    init,
  );
  return mapAdminResult(result, (value) => {
    if (!isRecord(value)) {
      return null;
    }

    return mapBooking(value.booking ?? value);
  });
}

export async function listAdminBookingFilterCatalog(
  init: RequestInit = {},
): Promise<AdminApiResult<AdminBookingFilterCatalog>> {
  const [customers, cleaners, services] = await Promise.all([
    adminRequest<unknown>(
      withAdminQuery(ADMIN_API_PATHS.customers, {
        limit: ADMIN_FILTER_CATALOG_LIMIT,
        page: 1,
        sort: "name",
        order: "asc",
      }),
      init,
    ),
    adminRequest<unknown>(
      withAdminQuery(ADMIN_API_PATHS.cleaners, {
        limit: ADMIN_FILTER_CATALOG_LIMIT,
        page: 1,
        sort: "name",
        order: "asc",
      }),
      init,
    ),
    adminRequest<unknown>(
      withAdminQuery(ADMIN_API_PATHS.services, {
        limit: ADMIN_FILTER_CATALOG_LIMIT,
        page: 1,
        sort: "name",
        order: "asc",
      }),
      init,
    ),
  ]);

  if (!customers.ok) {
    return customers;
  }

  if (!cleaners.ok) {
    return cleaners;
  }

  if (!services.ok) {
    return services;
  }

  const catalog: AdminBookingFilterCatalog = {
    cleaners: mapNamedOptions(cleaners.data),
    customers: mapNamedOptions(customers.data),
    services: mapNamedOptions(services.data),
  };

  return {
    data: catalog,
    ok: true,
    status: 200,
  };
}

function mapBookingList(value: unknown): AdminBookingList | null {
  if (!isRecord(value) || !Array.isArray(value.items)) {
    return null;
  }

  const pagination = mapAdminPagination(value.pagination, ADMIN_LIST_PAGE_SIZE);

  if (pagination === null) {
    return null;
  }

  const bookings: AdminBooking[] = [];

  for (const item of value.items) {
    const booking = mapBooking(item);

    if (booking === null) {
      return null;
    }

    bookings.push(booking);
  }

  return { bookings, pagination };
}

function mapBooking(value: unknown): AdminBooking | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = readString(value.id);
  const status = readString(value.status);

  if (id === null || !isBookingStatus(status)) {
    return null;
  }

  return {
    cleanerId: readNullableString(value.cleanerId),
    cleanerName: readPartyName(value.cleaner),
    customerId: readNullableString(value.customerId),
    customerName: readPartyName(value.customer),
    id,
    notes: readNullableString(value.notes),
    scheduledAt: readIsoDate(value.scheduledAt),
    serviceAddress: readNullableString(value.serviceAddress),
    serviceId: readNullableString(value.serviceId),
    serviceName: readPartyName(value.service),
    status,
  };
}

export interface AdminBookingCreateInput {
  cleanerId: string;
  customerId: string;
  notes: string;
  scheduledAt: string;
  serviceAddress: string;
  serviceId: string;
}

export interface AdminBookingUpdateInput {
  notes: string;
  scheduledAt: string;
  serviceAddress: string;
}

export async function createAdminBooking(
  input: AdminBookingCreateInput,
  init: RequestInit = {},
): Promise<AdminApiResult<AdminBooking>> {
  const result = await adminRequest<unknown>(ADMIN_API_PATHS.bookings, {
    ...init,
    body: JSON.stringify({
      cleanerId: emptyToNull(input.cleanerId),
      customerId: input.customerId,
      notes: emptyToNull(input.notes),
      scheduledAt: emptyToNull(input.scheduledAt),
      serviceAddress: emptyToNull(input.serviceAddress),
      serviceId: input.serviceId,
    }),
    method: "POST",
  });
  return mapAdminResult(result, mapBookingPayload);
}

export async function updateAdminBooking(
  id: string,
  input: AdminBookingUpdateInput,
  init: RequestInit = {},
): Promise<AdminApiResult<AdminBooking>> {
  const result = await adminRequest<unknown>(
    withAdminApiId(ADMIN_API_PATHS.booking, id),
    {
      ...init,
      body: JSON.stringify({
        notes: emptyToNull(input.notes),
        scheduledAt: emptyToNull(input.scheduledAt),
        serviceAddress: emptyToNull(input.serviceAddress),
      }),
      method: "PATCH",
    },
  );
  return mapAdminResult(result, mapBookingPayload);
}

export async function updateAdminBookingStatus(
  id: string,
  status: AdminBookingStatus,
  init: RequestInit = {},
): Promise<AdminApiResult<AdminBooking>> {
  const result = await adminRequest<unknown>(
    withAdminApiId(ADMIN_API_PATHS.bookingStatus, id),
    {
      ...init,
      body: JSON.stringify({ status }),
      method: "PATCH",
    },
  );
  return mapAdminResult(result, mapBookingPayload);
}

export async function assignAdminBookingCleaner(
  id: string,
  cleanerId: string,
  init: RequestInit = {},
): Promise<AdminApiResult<AdminBooking>> {
  const result = await adminRequest<unknown>(
    withAdminApiId(ADMIN_API_PATHS.bookingAssign, id),
    {
      ...init,
      body: JSON.stringify({ cleanerId }),
      method: "PATCH",
    },
  );
  return mapAdminResult(result, mapBookingPayload);
}

function mapBookingPayload(value: unknown): AdminBooking | null {
  if (!isRecord(value)) {
    return null;
  }

  return mapBooking(value.booking ?? value);
}

function mapNamedOptions(
  value: unknown,
): AdminBookingFilterCatalog["customers"] {
  if (!isRecord(value) || !Array.isArray(value.items)) {
    return [];
  }

  const options: AdminBookingFilterOption[] = [];

  for (const item of value.items) {
    if (!isRecord(item)) {
      continue;
    }

    const id = readString(item.id);
    const name = readNullableString(item.name);

    if (id === null) {
      continue;
    }

    options.push({
      id,
      label: name ?? id,
    });
  }

  return options;
}

function readPartyName(value: unknown): string | null {
  if (!isRecord(value)) {
    return null;
  }

  return readNullableString(value.name);
}

function isBookingStatus(value: string | null): value is AdminBookingStatus {
  return (
    value !== null &&
    (adminBookingStatuses as readonly string[]).includes(value)
  );
}

export function toDatetimeLocalValue(iso: string | null): string {
  if (iso === null || iso === "") {
    return "";
  }

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (value: number): string => String(value).padStart(2, "0");

  return `${String(date.getFullYear())}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function fromDatetimeLocalValue(value: string): string {
  const trimmed = value.trim();

  if (trimmed === "") {
    return "";
  }

  const date = new Date(trimmed);

  if (Number.isNaN(date.getTime())) {
    return trimmed;
  }

  return date.toISOString();
}

function extractDateOnly(value: string): string | null {
  const match = DATE_ONLY_PATTERN.exec(value);

  if (match === null) {
    return null;
  }

  const date = match[1];

  return date === undefined ? null : date;
}

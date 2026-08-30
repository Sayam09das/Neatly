import {
  ADMIN_API_PATHS,
  ADMIN_LIST_PAGE_SIZE,
  withAdminApiId,
} from "@/config/admin-api";
import {
  adminQuoteCopy,
  adminQuoteDateRangeLabels,
  adminQuoteFrequencyLabels,
  adminQuotePropertyTypeLabels,
  adminQuoteServiceTypeLabels,
  adminQuoteStatusLabels,
} from "@/config/admin-quotes";
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
import {
  ADMIN_QUOTE_DATE_RANGE_ALL,
  ADMIN_QUOTE_STATUS_ALL,
  type AdminQuote,
  type AdminQuoteDateRange,
  type AdminQuoteFilters,
  type AdminQuoteFrequency,
  type AdminQuotePagination,
  type AdminQuotePropertyType,
  type AdminQuoteServiceSummary,
  type AdminQuoteServiceType,
  type AdminQuoteStatus,
  type AdminQuoteStatusFilter,
  adminQuoteDateRanges,
  adminQuoteFrequencies,
  adminQuotePropertyTypes,
  adminQuoteServiceTypes,
  adminQuoteStatuses,
} from "@/types/admin-quote";

const MS_PER_DAY = 86_400_000;
const DAYS_IN_WEEK = 7;

export interface AdminQuoteDateBounds {
  end: Date;
  start: Date;
}

export interface AdminQuoteMetricCounts {
  converted: number;
  new: number;
  quoted: number;
  reviewing: number;
  total: number;
}

export function hasActiveQuoteFilters(filters: AdminQuoteFilters): boolean {
  return (
    filters.query.trim() !== "" ||
    filters.status !== ADMIN_QUOTE_STATUS_ALL ||
    filters.serviceType !== "" ||
    filters.dateRange !== ADMIN_QUOTE_DATE_RANGE_ALL ||
    filters.requestedFrom !== "" ||
    filters.requestedTo !== ""
  );
}

export function filterQuotes(
  quotes: readonly AdminQuote[],
  filters: AdminQuoteFilters,
  now: Date = new Date(),
): readonly AdminQuote[] {
  const query = filters.query.trim().toLowerCase();
  const range = resolveQuoteDateBounds(filters, now);

  return quotes.filter((quote): boolean => {
    if (
      filters.status !== ADMIN_QUOTE_STATUS_ALL &&
      quote.status !== filters.status
    ) {
      return false;
    }

    if (
      filters.serviceType !== "" &&
      quote.serviceType !== filters.serviceType
    ) {
      return false;
    }

    if (!matchesRequestedRange(quote.preferredDate, range)) {
      return false;
    }

    if (query === "") {
      return true;
    }

    const haystack = [quote.id, quote.fullName, quote.email]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
}

export function countQuoteMetrics(
  quotes: readonly AdminQuote[],
): AdminQuoteMetricCounts {
  return {
    converted: countQuotesByStatus(quotes, "CONVERTED"),
    new: countQuotesByStatus(quotes, "NEW"),
    quoted: countQuotesByStatus(quotes, "QUOTED"),
    reviewing: countQuotesByStatus(quotes, "REVIEWING"),
    total: quotes.length,
  };
}

export function resolveQuoteDateBounds(
  filters: AdminQuoteFilters,
  now: Date = new Date(),
): AdminQuoteDateBounds | null {
  if (filters.dateRange === "custom") {
    return resolveCustomDateBounds(filters.requestedFrom, filters.requestedTo);
  }

  if (filters.dateRange === "today") {
    return { end: endOfLocalDay(now), start: startOfLocalDay(now) };
  }

  if (filters.dateRange === "week") {
    const start = startOfLocalDay(now);
    start.setTime(start.getTime() - (DAYS_IN_WEEK - 1) * MS_PER_DAY);
    return { end: endOfLocalDay(now), start };
  }

  if (filters.dateRange === "month") {
    return {
      end: endOfLocalDay(now),
      start: startOfLocalMonth(now),
    };
  }

  return null;
}

export function formatQuoteDateFilterChip(
  filters: AdminQuoteFilters,
): string | null {
  if (filters.dateRange === ADMIN_QUOTE_DATE_RANGE_ALL) {
    if (filters.requestedFrom === "" && filters.requestedTo === "") {
      return null;
    }
  }

  if (filters.dateRange !== "custom" && filters.dateRange !== "all") {
    return adminQuoteDateRangeLabels[filters.dateRange];
  }

  if (filters.requestedFrom === "" && filters.requestedTo === "") {
    return null;
  }

  if (filters.requestedFrom !== "" && filters.requestedTo !== "") {
    return `${formatQuoteDateInput(filters.requestedFrom)} – ${formatQuoteDateInput(filters.requestedTo)}`;
  }

  if (filters.requestedFrom !== "") {
    return formatQuoteDateInput(filters.requestedFrom);
  }

  return formatQuoteDateInput(filters.requestedTo);
}

export function formatQuoteDateInput(isoDate: string): string {
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

export function formatQuoteRequestedAt(
  preferredDate: string,
  preferredTime: string,
): string {
  const dateLabel = formatQuoteInstant(preferredDate, {
    dateStyle: "medium",
  });

  if (dateLabel === adminQuoteCopy.emptyValue) {
    return preferredTime.trim() === ""
      ? adminQuoteCopy.emptyValue
      : preferredTime;
  }

  if (preferredTime.trim() === "") {
    return dateLabel;
  }

  return `${dateLabel} · ${preferredTime}`;
}

export function formatQuoteInstant(
  isoDateTime: string,
  options: Intl.DateTimeFormatOptions,
): string {
  if (isoDateTime.trim() === "") {
    return adminQuoteCopy.emptyValue;
  }

  const date = new Date(isoDateTime);

  if (Number.isNaN(date.getTime())) {
    return adminQuoteCopy.emptyValue;
  }

  return new Intl.DateTimeFormat(undefined, options).format(date);
}

export function getQuoteStatusLabel(status: AdminQuoteStatusFilter): string {
  if (status === ADMIN_QUOTE_STATUS_ALL) {
    return adminQuoteCopy.statusAll;
  }

  return adminQuoteStatusLabels[status];
}

export function getQuoteIdLabel(quoteId: string): string {
  if (quoteId.trim() === "") {
    return adminQuoteCopy.emptyValue;
  }

  return quoteId;
}

export function getQuoteCustomerName(name: string): string {
  if (name.trim() === "") {
    return adminQuoteCopy.emptyValue;
  }

  return name;
}

export function getQuoteServiceLabel(serviceType: string): string {
  if (!isAdminQuoteServiceType(serviceType)) {
    return adminQuoteCopy.emptyValue;
  }

  return adminQuoteServiceTypeLabels[serviceType];
}

export function getQuotePropertyLabel(propertyType: string): string {
  if (!isAdminQuotePropertyType(propertyType)) {
    return adminQuoteCopy.emptyValue;
  }

  return adminQuotePropertyTypeLabels[propertyType];
}

export function getQuoteFrequencyLabel(frequency: string): string {
  if (!isAdminQuoteFrequency(frequency)) {
    return adminQuoteCopy.emptyValue;
  }

  return adminQuoteFrequencyLabels[frequency];
}

export function shouldRenderQuotePagination(
  pagination: AdminQuotePagination | undefined,
  visibleCount: number,
): boolean {
  return (
    pagination !== undefined &&
    pagination.total > 0 &&
    pagination.totalPages > 1 &&
    visibleCount > 0
  );
}

export function paginateQuotes(
  quotes: readonly AdminQuote[],
  page: number,
  pageSize: number = ADMIN_LIST_PAGE_SIZE,
): {
  pagination: AdminQuotePagination;
  quotes: readonly AdminQuote[];
} {
  const total = quotes.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    pagination: {
      page: safePage,
      pageSize,
      total,
      totalPages: total === 0 ? 0 : totalPages,
    },
    quotes: quotes.slice(start, start + pageSize),
  };
}

function countQuotesByStatus(
  quotes: readonly AdminQuote[],
  status: AdminQuoteStatus,
): number {
  return quotes.filter((quote) => quote.status === status).length;
}

function matchesRequestedRange(
  preferredDate: string,
  range: AdminQuoteDateBounds | null,
): boolean {
  if (range === null) {
    return true;
  }

  const date = new Date(preferredDate);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return (
    date.getTime() >= range.start.getTime() &&
    date.getTime() <= range.end.getTime()
  );
}

function resolveCustomDateBounds(
  from: string,
  to: string,
): AdminQuoteDateBounds | null {
  if (from === "" && to === "") {
    return null;
  }

  const start =
    from === "" ? null : startOfLocalDay(new Date(`${from}T00:00:00`));
  const end = to === "" ? null : endOfLocalDay(new Date(`${to}T00:00:00`));

  if (start !== null && Number.isNaN(start.getTime())) {
    return null;
  }

  if (end !== null && Number.isNaN(end.getTime())) {
    return null;
  }

  if (start === null && end === null) {
    return null;
  }

  return {
    end: end ?? endOfLocalDay(start ?? new Date()),
    start: start ?? startOfLocalDay(end ?? new Date()),
  };
}

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function endOfLocalDay(date: Date): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999,
  );
}

function startOfLocalMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function isAdminQuoteServiceType(
  value: string,
): value is AdminQuoteServiceType {
  return adminQuoteServiceTypes.some((serviceType) => serviceType === value);
}

function isAdminQuotePropertyType(
  value: string,
): value is AdminQuotePropertyType {
  return adminQuotePropertyTypes.some((propertyType) => propertyType === value);
}

function isAdminQuoteFrequency(value: string): value is AdminQuoteFrequency {
  return adminQuoteFrequencies.some((frequency) => frequency === value);
}

export function isAdminQuoteStatus(value: string): value is AdminQuoteStatus {
  return adminQuoteStatuses.some((status) => status === value);
}

export function isAdminQuoteDateRange(
  value: string,
): value is AdminQuoteDateRange {
  return adminQuoteDateRanges.some((range) => range === value);
}

export function formatQuoteAmount(amount: number | null): string {
  if (amount === null || !Number.isFinite(amount)) {
    return adminQuoteCopy.emptyValue;
  }

  return new Intl.NumberFormat("en-IN", {
    currency: "INR",
    style: "currency",
  }).format(amount);
}

export interface AdminQuoteList {
  pagination: AdminQuotePagination;
  quotes: readonly AdminQuote[];
}

export interface AdminQuoteListQuery extends AdminQuoteFilters {
  page: number;
}

export async function listAdminQuotes(
  query: AdminQuoteListQuery,
  init: RequestInit = {},
): Promise<AdminApiResult<AdminQuoteList>> {
  const result = await adminRequest<unknown>(
    withAdminQuery(ADMIN_API_PATHS.quotes, {
      filters: {
        createdFrom: query.requestedFrom,
        createdTo: query.requestedTo,
        serviceType: query.serviceType === "" ? undefined : query.serviceType,
        status:
          query.status === ADMIN_QUOTE_STATUS_ALL ? undefined : query.status,
      },
      limit: ADMIN_LIST_PAGE_SIZE,
      page: query.page,
      search: query.query,
    }),
    init,
  );
  return mapAdminResult(result, mapQuoteList);
}

export async function getAdminQuote(
  id: string,
  init: RequestInit = {},
): Promise<AdminApiResult<AdminQuote>> {
  const result = await adminRequest<unknown>(
    withAdminApiId(ADMIN_API_PATHS.quote, id),
    init,
  );
  return mapAdminResult(result, (value) => {
    if (!isRecord(value)) {
      return null;
    }

    return mapQuote(value.quoteRequest ?? value);
  });
}

export interface AdminQuoteUpdateInput {
  adminNotes?: string | null;
  quotedAmount?: number;
  status?: AdminQuoteStatus;
}

export async function updateAdminQuote(
  id: string,
  input: AdminQuoteUpdateInput,
  init: RequestInit = {},
): Promise<AdminApiResult<AdminQuote>> {
  const result = await adminRequest<unknown>(
    withAdminApiId(ADMIN_API_PATHS.quote, id),
    {
      ...init,
      body: JSON.stringify(input),
      method: "PATCH",
    },
  );
  return mapAdminResult(result, (value) => {
    if (!isRecord(value)) {
      return null;
    }

    return mapQuote(value.quoteRequest ?? value);
  });
}

function mapQuoteList(value: unknown): AdminQuoteList | null {
  if (!isRecord(value) || !Array.isArray(value.items)) {
    return null;
  }

  const pagination = mapAdminPagination(value.pagination, ADMIN_LIST_PAGE_SIZE);

  if (pagination === null) {
    return null;
  }

  const quotes: AdminQuote[] = [];

  for (const item of value.items) {
    const quote = mapQuote(item);

    if (quote === null) {
      return null;
    }

    quotes.push(quote);
  }

  return { pagination, quotes };
}

function mapQuote(value: unknown): AdminQuote | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = readString(value.id);
  const status = readString(value.status);
  const serviceType = readString(value.serviceType);
  const propertyType = readString(value.propertyType);
  const frequency = readString(value.frequency);

  if (
    id === null ||
    status === null ||
    serviceType === null ||
    propertyType === null ||
    frequency === null ||
    !isAdminQuoteStatus(status) ||
    !isAdminQuoteServiceType(serviceType) ||
    !isAdminQuotePropertyType(propertyType) ||
    !isAdminQuoteFrequency(frequency)
  ) {
    return null;
  }

  const approximateSize = readString(value.approximateSize);
  const email = readString(value.email);
  const fullName = readString(value.fullName);
  const phone = readString(value.phone);
  const preferredTime = readString(value.preferredTime);
  const serviceAddress = readString(value.serviceAddress);
  const createdAt = readIsoDate(value.createdAt);
  const updatedAt = readIsoDate(value.updatedAt);
  const preferredDate = readIsoDate(value.preferredDate);

  if (
    approximateSize === null ||
    email === null ||
    fullName === null ||
    phone === null ||
    preferredTime === null ||
    serviceAddress === null ||
    createdAt === null ||
    updatedAt === null ||
    preferredDate === null
  ) {
    return null;
  }

  return {
    additionalNotes: readNullableString(value.additionalNotes),
    adminNotes: readNullableString(value.adminNotes),
    approximateSize,
    bathrooms: readNullableNumber(value.bathrooms),
    bedrooms: readNullableNumber(value.bedrooms),
    bookingId: readNullableString(value.bookingId),
    createdAt,
    email,
    frequency,
    fullName,
    id,
    phone,
    preferredDate,
    preferredTime,
    propertyType,
    quotedAmount: readNullableNumber(value.quotedAmount),
    service: mapQuoteService(value.service),
    serviceAddress,
    serviceId: readNullableString(value.serviceId),
    serviceType,
    status,
    updatedAt,
  };
}

function mapQuoteService(value: unknown): AdminQuoteServiceSummary | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = readString(value.id);
  const name = readString(value.name);
  const slug = readString(value.slug);

  if (id === null || name === null || slug === null) {
    return null;
  }

  return { id, name, slug };
}

function readNullableNumber(value: unknown): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  return value;
}

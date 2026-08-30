import { ADMIN_LIST_PAGE_SIZE } from "@/config/admin-api";
import {
  adminQuoteCopy,
  adminQuoteDateRangeLabels,
  adminQuoteFrequencyLabels,
  adminQuotePropertyTypeLabels,
  adminQuoteServiceTypeLabels,
  adminQuoteStatusLabels,
} from "@/config/admin-quotes";
import {
  ADMIN_QUOTE_DATE_RANGE_ALL,
  ADMIN_QUOTE_STATUS_ALL,
  type AdminQuote,
  type AdminQuoteDateRange,
  type AdminQuoteFilters,
  type AdminQuoteFrequency,
  type AdminQuotePagination,
  type AdminQuotePropertyType,
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

export const ADMIN_QUOTE_STATUS_ALL = "all" as const;

export const adminQuoteStatuses = [
  "NEW",
  "REVIEWING",
  "CONTACTED",
  "QUOTED",
  "CONVERTED",
  "DECLINED",
  "CLOSED",
] as const;

export type AdminQuoteStatus = (typeof adminQuoteStatuses)[number];

export type AdminQuoteStatusFilter =
  | typeof ADMIN_QUOTE_STATUS_ALL
  | AdminQuoteStatus;

export const adminQuoteServiceTypes = [
  "RESIDENTIAL",
  "DEEP_CLEAN",
  "MOVE_IN_OUT",
  "COMMERCIAL",
  "CUSTOM",
] as const;

export type AdminQuoteServiceType = (typeof adminQuoteServiceTypes)[number];

export const adminQuotePropertyTypes = [
  "HOUSE",
  "APARTMENT",
  "CONDO",
  "OFFICE",
  "COMMERCIAL_SPACE",
] as const;

export type AdminQuotePropertyType = (typeof adminQuotePropertyTypes)[number];

export const adminQuoteFrequencies = [
  "ONE_TIME",
  "WEEKLY",
  "BI_WEEKLY",
  "MONTHLY",
] as const;

export type AdminQuoteFrequency = (typeof adminQuoteFrequencies)[number];

export const ADMIN_QUOTE_DATE_RANGE_ALL = "all" as const;

export const adminQuoteDateRanges = [
  "all",
  "today",
  "week",
  "month",
  "custom",
] as const;

export type AdminQuoteDateRange = (typeof adminQuoteDateRanges)[number];

export interface AdminQuote {
  additionalNotes: string | null;
  approximateSize: string;
  bathrooms: number | null;
  bedrooms: number | null;
  createdAt: string;
  email: string;
  frequency: AdminQuoteFrequency;
  fullName: string;
  id: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  propertyType: AdminQuotePropertyType;
  serviceAddress: string;
  serviceId: string | null;
  serviceType: AdminQuoteServiceType;
  status: AdminQuoteStatus;
  updatedAt: string;
}

export interface AdminQuoteFilters {
  dateRange: AdminQuoteDateRange;
  query: string;
  requestedFrom: string;
  requestedTo: string;
  serviceType: string;
  status: AdminQuoteStatusFilter;
}

export interface AdminQuotePagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export type AdminQuotePresentation =
  | { status: "loading" }
  | { status: "empty" }
  | { onRetry: () => void; status: "error" }
  | {
      pagination?: AdminQuotePagination;
      quotes: readonly AdminQuote[];
      status: "ready";
    };

export type AdminQuoteDetailsPresentation =
  | { status: "loading" }
  | { status: "empty" }
  | { onRetry: () => void; status: "error" }
  | { quote: AdminQuote; status: "ready" };

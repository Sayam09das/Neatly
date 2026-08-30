import { ADMIN_PATHS } from "@/config/admin-nav";
import {
  customerQuoteFrequencyLabels,
  customerQuotePropertyTypeLabels,
  customerQuoteServiceTypeLabels,
} from "@/config/customer";
import {
  ADMIN_QUOTE_DATE_RANGE_ALL,
  ADMIN_QUOTE_STATUS_ALL,
  type AdminQuoteDateRange,
  type AdminQuoteFilters,
  type AdminQuoteFrequency,
  type AdminQuotePropertyType,
  type AdminQuoteServiceType,
  type AdminQuoteStatus,
  adminQuoteDateRanges,
  adminQuoteServiceTypes,
  adminQuoteStatuses,
} from "@/types/admin-quote";

export const ADMIN_QUOTE_DETAILS_PATH = `${ADMIN_PATHS.quotes}/[id]`;

export const adminQuoteCopy = {
  actionsLabel: "Open quote actions",
  addressLabel: "Address",
  backToQuotes: "Back to quotes",
  bathroomsLabel: "Bathrooms",
  bedroomsLabel: "Bedrooms",
  clearFilters: "Clear filters",
  closeFiltersLabel: "Close filters",
  comingSoonHint: "Actions",
  createBookingAction: "Create booking",
  createBookingUnavailable: "Booking conversion is not available yet.",
  customerEmailLabel: "Email",
  customerNameLabel: "Name",
  customerPhoneLabel: "Phone",
  customerSection: "Customer",
  dateFromLabel: "From",
  dateRangeLabel: "Date",
  dateToLabel: "To",
  description:
    "Manage customer quote requests and convert qualified requests into bookings.",
  detailsDescription: "Review the request details and current quote status.",
  detailsHeading: "Quote details",
  detailsNotFoundDescription:
    "This quote request is not available. Return to the quotes list.",
  detailsNotFoundTitle: "Quote not found",
  detailsTitle: "Quote",
  emptyDescription: "Customer quote requests will appear here once submitted.",
  emptyTitle: "No quote requests yet",
  emptyValue: "—",
  errorDescription: "We couldn't load quotes.",
  errorTitle: "Unable to load quotes",
  filterSheetDescription:
    "Narrow quote requests by status, service, and requested date.",
  filterSheetTitle: "Filters",
  filterServiceLabel: "Service",
  filtersLabel: "Filters",
  frequencyLabel: "Frequency",
  heading: "Quotes",
  loadingLabel: "Loading quotes",
  metricConverted: "Converted",
  metricNew: "New",
  metricQuoted: "Quoted",
  metricReviewing: "In review",
  metricTotal: "Total quotes",
  noMatchesDescription: "Try adjusting your search or filters.",
  noMatchesTitle: "No quotes found",
  notesEmpty: "No additional notes were provided.",
  notesLabel: "Customer notes",
  paginationLabel: "Quotes pagination",
  paginationNext: "Next",
  paginationPageLabel: "Page",
  paginationPrevious: "Previous",
  requestSection: "Request details",
  requestedServiceSection: "Requested service",
  retryLabel: "Try again",
  searchLabel: "Search quotes",
  searchPlaceholder: "Search quotes...",
  sizeLabel: "Approximate size",
  statusAll: "All",
  statusLabel: "Status",
  statusSection: "Quote status",
  tableActions: "Actions",
  tableCreated: "Created",
  tableCustomer: "Customer",
  tableLabel: "Quote requests",
  tableProperty: "Property",
  tableQuote: "Quote",
  tableRequested: "Requested",
  tableService: "Service",
  tableStatus: "Status",
  timelineCreated: "Created",
  timelineSection: "Timeline",
  timelineUpdated: "Updated",
  title: "Quotes",
  viewAction: "View quote",
} as const;

export const adminQuoteStatusLabels: Record<AdminQuoteStatus, string> = {
  CLOSED: "Closed",
  CONTACTED: "Contacted",
  CONVERTED: "Converted",
  DECLINED: "Declined",
  NEW: "New",
  QUOTED: "Quoted",
  REVIEWING: "In review",
};

export const adminQuoteServiceTypeLabels: Record<
  AdminQuoteServiceType,
  string
> = customerQuoteServiceTypeLabels;

export const adminQuotePropertyTypeLabels: Record<
  AdminQuotePropertyType,
  string
> = customerQuotePropertyTypeLabels;

export const adminQuoteFrequencyLabels: Record<AdminQuoteFrequency, string> =
  customerQuoteFrequencyLabels;

export const adminQuoteDateRangeLabels: Record<AdminQuoteDateRange, string> = {
  all: "All dates",
  custom: "Custom date",
  month: "This month",
  today: "Today",
  week: "This week",
};

export const defaultAdminQuoteFilters: AdminQuoteFilters = {
  dateRange: ADMIN_QUOTE_DATE_RANGE_ALL,
  query: "",
  requestedFrom: "",
  requestedTo: "",
  serviceType: "",
  status: ADMIN_QUOTE_STATUS_ALL,
};

export const adminQuoteStatusFilterOptions = [
  {
    label: adminQuoteCopy.statusAll,
    value: ADMIN_QUOTE_STATUS_ALL,
  },
  ...adminQuoteStatuses.map((status) => ({
    label: adminQuoteStatusLabels[status],
    value: status,
  })),
];

export const adminQuoteServiceFilterOptions = [
  {
    label: adminQuoteCopy.statusAll,
    value: "",
  },
  ...adminQuoteServiceTypes.map((serviceType) => ({
    label: adminQuoteServiceTypeLabels[serviceType],
    value: serviceType,
  })),
];

export const adminQuoteDateRangeFilterOptions = adminQuoteDateRanges.map(
  (range) => ({
    label: adminQuoteDateRangeLabels[range],
    value: range,
  }),
);

export function getAdminQuoteDetailsPath(quoteId: string): string {
  return `${ADMIN_PATHS.quotes}/${quoteId}`;
}

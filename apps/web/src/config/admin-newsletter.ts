import { ADMIN_PATHS } from "@/config/admin-nav";
import {
  ADMIN_NEWSLETTER_DATE_RANGE_ALL,
  ADMIN_NEWSLETTER_STATUS_ALL,
  type AdminNewsletterDateRange,
  type AdminNewsletterFilters,
  type AdminNewsletterStatus,
  adminNewsletterDateRanges,
  adminNewsletterStatuses,
} from "@/types/admin-newsletter";

export const ADMIN_NEWSLETTER_DETAILS_PATH = `${ADMIN_PATHS.newsletter}/[id]`;

export const adminNewsletterCopy = {
  actionsLabel: "Open subscriber actions",
  backToNewsletter: "Back to newsletter",
  clearFilters: "Clear filters",
  closeFiltersLabel: "Close filters",
  comingSoonHint: "Actions",
  dateFromLabel: "From",
  dateRangeLabel: "Date",
  dateToLabel: "To",
  description: "Review newsletter subscribers and prepare list exports.",
  detailsDescription: "Review the subscriber record and current status.",
  detailsHeading: "Subscriber",
  detailsNotFoundDescription:
    "This subscriber is not available. Return to the newsletter list.",
  detailsNotFoundTitle: "Subscriber not found",
  detailsTitle: "Newsletter",
  emptyDescription:
    "Newsletter subscribers will appear here once people sign up.",
  emptyTitle: "No newsletter subscribers yet",
  emptyValue: "—",
  errorDescription: "We couldn't load newsletter subscribers.",
  errorTitle: "Unable to load newsletter",
  exportAction: "Export CSV",
  exportUnavailable: "CSV export is not available yet.",
  filterSheetDescription: "Narrow subscribers by status and date.",
  filterSheetTitle: "Filters",
  filtersLabel: "Filters",
  heading: "Newsletter",
  loadingLabel: "Loading newsletter",
  metricSubscribed: "Subscribed",
  metricTotal: "Total subscribers",
  metricUnsubscribed: "Unsubscribed",
  noMatchesDescription: "Try adjusting your search or filters.",
  noMatchesTitle: "No subscribers found",
  paginationLabel: "Newsletter pagination",
  paginationNext: "Next",
  paginationPageLabel: "Page",
  paginationPrevious: "Previous",
  retryLabel: "Try again",
  searchLabel: "Search subscribers",
  searchPlaceholder: "Search subscribers...",
  statusAll: "All",
  statusLabel: "Status",
  statusSection: "Subscription status",
  subscriberSection: "Subscriber",
  tableActions: "Actions",
  tableEmail: "Email",
  tableLabel: "Newsletter subscribers",
  tableStatus: "Status",
  tableSubscribed: "Subscribed",
  tableUnsubscribed: "Unsubscribed",
  timelineCreated: "Created",
  timelineSection: "Timeline",
  timelineUpdated: "Updated",
  title: "Newsletter",
  viewAction: "View subscriber",
} as const;

export const adminNewsletterStatusLabels: Record<
  AdminNewsletterStatus,
  string
> = {
  SUBSCRIBED: "Subscribed",
  UNSUBSCRIBED: "Unsubscribed",
};

export const adminNewsletterDateRangeLabels: Record<
  AdminNewsletterDateRange,
  string
> = {
  all: "All dates",
  custom: "Custom date",
  month: "This month",
  today: "Today",
  week: "This week",
};

export const defaultAdminNewsletterFilters: AdminNewsletterFilters = {
  dateRange: ADMIN_NEWSLETTER_DATE_RANGE_ALL,
  query: "",
  status: ADMIN_NEWSLETTER_STATUS_ALL,
  subscribedFrom: "",
  subscribedTo: "",
};

export const adminNewsletterStatusFilterOptions = [
  {
    label: adminNewsletterCopy.statusAll,
    value: ADMIN_NEWSLETTER_STATUS_ALL,
  },
  ...adminNewsletterStatuses.map((status) => ({
    label: adminNewsletterStatusLabels[status],
    value: status,
  })),
];

export const adminNewsletterDateRangeFilterOptions =
  adminNewsletterDateRanges.map((range) => ({
    label: adminNewsletterDateRangeLabels[range],
    value: range,
  }));

export function getAdminNewsletterDetailsPath(subscriberId: string): string {
  return `${ADMIN_PATHS.newsletter}/${subscriberId}`;
}

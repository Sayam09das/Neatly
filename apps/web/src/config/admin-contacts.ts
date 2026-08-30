import { ADMIN_PATHS } from "@/config/admin-nav";
import {
  ADMIN_CONTACT_DATE_RANGE_ALL,
  ADMIN_CONTACT_STATUS_ALL,
  type AdminContactDateRange,
  type AdminContactFilters,
  type AdminContactStatus,
  adminContactDateRanges,
  adminContactStatuses,
} from "@/types/admin-contact";

export const ADMIN_CONTACT_DETAILS_PATH = `${ADMIN_PATHS.contacts}/[id]`;
export const ADMIN_CONTACT_MESSAGE_PREVIEW_LENGTH = 80;

export const adminContactCopy = {
  actionsLabel: "Open contact actions",
  archiveAction: "Archive",
  archiveUnavailable: "Archiving is not available yet.",
  backToContacts: "Back to contacts",
  clearFilters: "Clear filters",
  closeFiltersLabel: "Close filters",
  comingSoonHint: "Actions",
  customerEmailLabel: "Email",
  customerNameLabel: "Name",
  customerPhoneLabel: "Phone",
  customerSection: "Customer",
  dateFromLabel: "From",
  dateRangeLabel: "Date",
  dateToLabel: "To",
  description: "Read and follow up on general contact inquiries.",
  detailsDescription: "Review the inquiry and current message status.",
  detailsHeading: "Contact details",
  detailsNotFoundDescription:
    "This contact message is not available. Return to the contacts inbox.",
  detailsNotFoundTitle: "Message not found",
  detailsTitle: "Contact",
  emptyDescription:
    "Customer contact messages will appear here once submitted.",
  emptyTitle: "No contact messages yet",
  emptyValue: "—",
  errorDescription: "We couldn't load contacts.",
  errorTitle: "Unable to load contacts",
  filterSheetDescription: "Narrow contact messages by status and date.",
  filterSheetTitle: "Filters",
  filtersLabel: "Filters",
  heading: "Contacts",
  loadingLabel: "Loading contacts",
  markReadAction: "Mark as read",
  markReadUnavailable: "Status updates are not available yet.",
  messageSection: "Message",
  metricArchived: "Archived",
  metricNew: "New",
  metricRead: "Read",
  metricResponded: "Responded",
  metricTotal: "Total messages",
  noMatchesDescription: "Try adjusting your search or filters.",
  noMatchesTitle: "No contacts found",
  notesEmpty: "No internal notes have been added.",
  notesLabel: "Internal notes",
  notesSection: "Internal notes",
  paginationLabel: "Contacts pagination",
  paginationNext: "Next",
  paginationPageLabel: "Page",
  paginationPrevious: "Previous",
  retryLabel: "Try again",
  searchLabel: "Search contacts",
  searchPlaceholder: "Search contacts...",
  statusAll: "All",
  statusLabel: "Status",
  statusSection: "Message status",
  tableActions: "Actions",
  tableCreated: "Created",
  tableCustomer: "Customer",
  tableLabel: "Contact messages",
  tableMessage: "Message",
  tableStatus: "Status",
  tableSubject: "Subject",
  timelineCreated: "Created",
  timelineSection: "Timeline",
  timelineUpdated: "Updated",
  title: "Contacts",
  viewAction: "View message",
} as const;

export const adminContactStatusLabels: Record<AdminContactStatus, string> = {
  ARCHIVED: "Archived",
  NEW: "New",
  READ: "Read",
  RESPONDED: "Responded",
};

export const adminContactDateRangeLabels: Record<
  AdminContactDateRange,
  string
> = {
  all: "All dates",
  custom: "Custom date",
  month: "This month",
  today: "Today",
  week: "This week",
};

export const defaultAdminContactFilters: AdminContactFilters = {
  createdFrom: "",
  createdTo: "",
  dateRange: ADMIN_CONTACT_DATE_RANGE_ALL,
  query: "",
  status: ADMIN_CONTACT_STATUS_ALL,
};

export const adminContactStatusFilterOptions = [
  {
    label: adminContactCopy.statusAll,
    value: ADMIN_CONTACT_STATUS_ALL,
  },
  ...adminContactStatuses.map((status) => ({
    label: adminContactStatusLabels[status],
    value: status,
  })),
];

export const adminContactDateRangeFilterOptions = adminContactDateRanges.map(
  (range) => ({
    label: adminContactDateRangeLabels[range],
    value: range,
  }),
);

export function getAdminContactDetailsPath(contactId: string): string {
  return `${ADMIN_PATHS.contacts}/${contactId}`;
}

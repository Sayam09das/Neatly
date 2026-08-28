import { ADMIN_PATHS } from "@/config/admin-nav";
import {
  ADMIN_BOOKING_STATUS_ALL,
  type AdminBookingFilterCatalog,
  type AdminBookingFilters,
  type AdminBookingStatus,
  adminBookingStatuses,
} from "@/types/admin-booking";

export const ADMIN_BOOKING_DETAILS_PATH = `${ADMIN_PATHS.bookings}/[id]`;

export const adminBookingCopy = {
  actionsLabel: "Open booking actions",
  assignCleanerAction: "Assign cleaner",
  cancelAction: "Cancel booking",
  changeStatusAction: "Change status",
  clearFilters: "Clear filters",
  closeCreateLabel: "Close",
  closeFiltersLabel: "Close filters",
  createDescription:
    "Creating bookings requires backend integration. This action is not available yet.",
  createTitle: "Booking creation unavailable",
  comingSoonHint: "Coming soon",
  customerEmpty: "No customer assigned",
  dateFromLabel: "From",
  dateToLabel: "To",
  description: "Review and manage scheduled customer bookings.",
  editAction: "Edit booking",
  emptyDescription:
    "Bookings will appear here once customers begin scheduling cleaning services.",
  emptyTitle: "No bookings yet",
  emptyValue: "—",
  errorDescription: "Bookings could not be shown. You can try again.",
  errorTitle: "Unable to load bookings",
  filterCleanerEmpty: "No cleaners available",
  filterCleanerLabel: "Cleaner",
  filterCustomerEmpty: "No customers available",
  filterCustomerLabel: "Customer",
  filterDateLabel: "Date",
  filterServiceEmpty: "No services available",
  filterServiceLabel: "Service",
  filterSheetDescription:
    "Narrow the bookings list by status, date, and assignment.",
  filterSheetTitle: "Filters",
  filtersLabel: "Filters",
  heading: "Bookings",
  loadingLabel: "Loading bookings",
  noMatchesDescription:
    "No bookings match the current filters. Clear filters to reset the list.",
  noMatchesTitle: "No matching bookings",
  paginationLabel: "Bookings pagination",
  paginationNext: "Next",
  paginationPageLabel: "Page",
  paginationPrevious: "Previous",
  primaryAction: "New booking",
  retryLabel: "Try again",
  searchLabel: "Search bookings",
  searchPlaceholder: "Search bookings...",
  statusAll: "All",
  statusLabel: "Status",
  tableActions: "Actions",
  tableBooking: "Booking",
  tableCleaner: "Cleaner",
  tableCustomer: "Customer",
  tableLabel: "Cleaning bookings",
  tableScheduled: "Scheduled",
  tableService: "Service",
  tableStatus: "Status",
  title: "Bookings",
  unassignedCleaner: "Unassigned",
  viewDetailsAction: "View details",
} as const;

export const adminBookingStatusLabels: Record<AdminBookingStatus, string> = {
  ASSIGNED: "Assigned",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
  CONFIRMED: "Confirmed",
  IN_PROGRESS: "In Progress",
  PENDING: "Pending",
};

export const defaultAdminBookingFilters: AdminBookingFilters = {
  cleanerId: "",
  customerId: "",
  query: "",
  scheduledFrom: "",
  scheduledTo: "",
  serviceId: "",
  status: ADMIN_BOOKING_STATUS_ALL,
};

export const emptyAdminBookingFilterCatalog: AdminBookingFilterCatalog = {
  cleaners: [],
  customers: [],
  services: [],
};

export const adminBookingStatusFilterOptions = [
  {
    label: adminBookingCopy.statusAll,
    value: ADMIN_BOOKING_STATUS_ALL,
  },
  ...adminBookingStatuses.map((status) => ({
    label: adminBookingStatusLabels[status],
    value: status,
  })),
];

export function getAdminBookingDetailsPath(bookingId: string): string {
  return `${ADMIN_PATHS.bookings}/${bookingId}`;
}

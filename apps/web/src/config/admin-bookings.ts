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
  assignCleanerDescription: "Assign an eligible cleaner to this booking.",
  assignCleanerError: "Booking could not be assigned.",
  assignCleanerSuccess: "Booking assigned.",
  assignCleanerTitle: "Assign cleaner",
  cancelAction: "Cancel booking",
  cancelError: "Unable to cancel booking.",
  cancelLabel: "Close",
  cancelSuccess: "Booking cancelled.",
  changeStatusAction: "Change status",
  changeStatusDescription:
    "The server decides whether this transition is valid.",
  changeStatusError: "Unable to update booking status.",
  changeStatusSuccess: "Booking status updated.",
  changeStatusTitle: "Change booking status",
  confirmCancelAction: "Cancel booking",
  confirmCancelDescription:
    "Cancellation is only allowed for supported booking states.",
  confirmCancelTitle: "Cancel this booking?",
  createDescription: "Create a booking for an existing customer and service.",
  createError: "Unable to create booking.",
  createSuccess: "Booking created.",
  createTitle: "New booking",
  clearFilters: "Clear filters",
  closeFiltersLabel: "Close filters",
  comingSoonHint: "Actions",
  editDescription: "Update notes, schedule, or service address.",
  editError: "Unable to update booking.",
  editSuccess: "Booking updated.",
  editTitle: "Edit booking",
  notesLabel: "Notes",
  saveLabel: "Save",
  scheduledAtLabel: "Scheduled",
  serviceAddressLabel: "Service address",
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
  selectCustomer: "Select a customer",
  selectService: "Select a service",
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

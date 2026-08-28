import { ADMIN_PATHS } from "@/config/admin-nav";
import type {
  AdminCustomerFilterCatalog,
  AdminCustomerFilters,
} from "@/types/admin-customer";

export const ADMIN_CUSTOMER_DETAILS_PATH = `${ADMIN_PATHS.customers}/[id]`;

export const adminCustomerCopy = {
  actionsLabel: "Open customer actions",
  activityEmpty: "No activity filters available",
  activityLabel: "Activity",
  closeCreateLabel: "Close",
  closeFiltersLabel: "Close filters",
  comingSoonHint: "Coming soon",
  createDescription:
    "Adding customers requires backend integration. This action is not available yet.",
  createTitle: "Customer creation unavailable",
  clearFilters: "Clear filters",
  deactivateAction: "Deactivate customer",
  deleteAction: "Delete customer",
  description: "View and manage the people using Neatly.",
  editAction: "Edit customer",
  emptyDescription:
    "Customers will appear here once people begin using Neatly.",
  emptyTitle: "No customers yet",
  emptyValue: "—",
  errorDescription: "Customers could not be shown. You can try again.",
  errorTitle: "Unable to load customers",
  filterDateLabel: "Joined",
  filterSheetDescription:
    "Narrow the customer list by status, activity, and join date.",
  filterSheetTitle: "Filters",
  filtersLabel: "Filters",
  heading: "Customers",
  joinedFromLabel: "From",
  joinedToLabel: "To",
  loadingLabel: "Loading customers",
  noMatchesDescription:
    "No customers match the current filters. Clear filters to reset the list.",
  noMatchesTitle: "No matching customers",
  paginationLabel: "Customers pagination",
  paginationNext: "Next",
  paginationPageLabel: "Page",
  paginationPrevious: "Previous",
  primaryAction: "Add customer",
  retryLabel: "Try again",
  searchLabel: "Search customers",
  searchPlaceholder: "Search customers...",
  statusEmpty: "No statuses available",
  statusLabel: "Status",
  tableActions: "Actions",
  tableBookings: "Bookings",
  tableContact: "Contact",
  tableCustomer: "Customer",
  tableJoined: "Joined",
  tableLabel: "Customers",
  tableStatus: "Status",
  title: "Customers",
  viewAction: "View customer",
} as const;

export const defaultAdminCustomerFilters: AdminCustomerFilters = {
  joinedFrom: "",
  joinedTo: "",
  query: "",
  status: "",
};

export const emptyAdminCustomerFilterCatalog: AdminCustomerFilterCatalog = {
  statuses: [],
};

export function getAdminCustomerDetailsPath(customerId: string): string {
  return `${ADMIN_PATHS.customers}/${customerId}`;
}

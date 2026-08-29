import { ADMIN_PATHS } from "@/config/admin-nav";
import type {
  AdminServiceFilterCatalog,
  AdminServiceFilters,
  AdminServiceStatus,
} from "@/types/admin-service";

export const ADMIN_SERVICE_DETAILS_PATH = `${ADMIN_PATHS.services}/[id]`;

export const adminServiceStatusLabels: Record<AdminServiceStatus, string> = {
  active: "Active",
  inactive: "Inactive",
};

export const adminServiceCopy = {
  actionsLabel: "Open service actions",
  activateAction: "Activate",
  archiveError: "Unable to archive service.",
  archiveSuccess: "Service archived.",
  cancelLabel: "Cancel",
  closeCreateLabel: "Close",
  closeFiltersLabel: "Close filters",
  comingSoonHint: "Actions",
  confirmArchiveAction: "Archive",
  confirmArchiveDescription:
    "The service will be hidden from the public catalog. Existing bookings are kept.",
  confirmArchiveTitle: "Archive this service?",
  createDescription:
    "Add a catalog service. Pricing is not stored on this form.",
  createError: "Unable to create service.",
  createSuccess: "Service created.",
  createTitle: "Add service",
  editDescription: "Update the catalog copy for this service.",
  editError: "Unable to update service.",
  editSuccess: "Service updated.",
  editTitle: "Edit service",
  fullDescriptionLabel: "Full description",
  nameLabel: "Name",
  saveLabel: "Save",
  shortDescriptionLabel: "Short description",
  clearFilters: "Clear filters",
  deactivateAction: "Deactivate",
  deleteAction: "Delete",
  description: "Manage the cleaning services available through Neatly.",
  editAction: "Edit service",
  emptyDescription: "Services will appear here once they are configured.",
  emptyTitle: "No services yet",
  emptyValue: "—",
  errorDescription: "Services could not be shown. You can try again.",
  errorTitle: "Unable to load services",
  filterSheetDescription: "Narrow the service list by publication status.",
  filterSheetTitle: "Filters",
  filtersLabel: "Filters",
  heading: "Services",
  loadingLabel: "Loading services",
  noMatchesDescription:
    "No services match the current filters. Clear filters to reset the list.",
  noMatchesTitle: "No matching services",
  paginationLabel: "Services pagination",
  paginationNext: "Next",
  paginationPageLabel: "Page",
  paginationPrevious: "Previous",
  primaryAction: "Add service",
  retryLabel: "Try again",
  searchLabel: "Search services",
  searchPlaceholder: "Search services...",
  statusAll: "All statuses",
  statusLabel: "Status",
  tableActions: "Actions",
  tableDescription: "Description",
  tableLabel: "Services",
  tableService: "Service",
  tableStatus: "Status",
  title: "Services",
  viewAction: "View service",
} as const;

export const defaultAdminServiceFilters: AdminServiceFilters = {
  query: "",
  status: "",
};

export const adminServiceFilterCatalog: AdminServiceFilterCatalog = {
  statuses: [
    { id: "active", label: adminServiceStatusLabels.active },
    { id: "inactive", label: adminServiceStatusLabels.inactive },
  ],
};

export function getAdminServiceDetailsPath(serviceId: string): string {
  return `${ADMIN_PATHS.services}/${serviceId}`;
}

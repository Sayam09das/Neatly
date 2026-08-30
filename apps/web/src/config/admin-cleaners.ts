import { ADMIN_PATHS } from "@/config/admin-nav";
import type {
  AdminCleanerFilterCatalog,
  AdminCleanerFilters,
} from "@/types/admin-cleaner";

export const adminCleanerCopy = {
  actionsLabel: "Open cleaner actions",
  activateAction: "Reactivate cleaner",
  availabilityAction: "View availability",
  cancelLabel: "Cancel",
  confirmDeactivateAction: "Deactivate",
  confirmDeactivateDescription:
    "They will no longer be able to access their account. Existing job records are kept.",
  confirmDeactivateTitle: "Deactivate this cleaner?",
  createDescription:
    "Add a cleaner. Neatly will send a secure invitation so they can create a password.",
  createError: "Unable to create cleaner.",
  createSuccess: "Cleaner created successfully. Invitation email sent.",
  createSuccessEmailFailed:
    "Cleaner created, but the invitation could not be sent.",
  createTitle: "Add cleaner",
  deactivateAction: "Deactivate cleaner",
  deactivateError: "Unable to update cleaner status.",
  deactivateSuccess: "Cleaner deactivated.",
  description:
    "Create and manage cleaner accounts. Cleaners do not self-register.",
  editAction: "Edit cleaner",
  editDescription: "Update the cleaner’s contact details.",
  editError: "Unable to update cleaner.",
  editSuccess: "Cleaner updated.",
  editTitle: "Edit cleaner",
  emailLabel: "Email",
  emptyDescription:
    "Add a cleaner to send a secure invitation and give them access.",
  emptyTitle: "No cleaners yet",
  emptyValue: "—",
  errorDescription: "Cleaners could not be shown. You can try again.",
  errorTitle: "Unable to load cleaners",
  heading: "Cleaners",
  jobsAction: "View jobs",
  loadingLabel: "Loading cleaners",
  nameLabel: "Full name",
  noMatchesDescription:
    "No cleaners match the current filters. Clear filters to reset the list.",
  noMatchesTitle: "No matching cleaners",
  paginationLabel: "Cleaners pagination",
  paginationNext: "Next",
  paginationPageLabel: "Page",
  paginationPrevious: "Previous",
  phoneLabel: "Phone",
  primaryAction: "Add Cleaner",
  reactivateSuccess: "Cleaner reactivated.",
  resendAction: "Resend invitation",
  resendError: "Unable to resend the invitation.",
  resendSuccess: "Invitation email sent.",
  retryLabel: "Try again",
  saveLabel: "Save",
  scheduleAction: "View schedule",
  searchLabel: "Search cleaners",
  searchPlaceholder: "Search cleaners...",
  statusLabel: "Account state",
  tableAccount: "Account",
  tableActions: "Actions",
  tableCleaner: "Cleaner",
  tableContact: "Contact",
  tableCreated: "Created",
  tableLabel: "Cleaners",
  tablePhone: "Phone",
  title: "Cleaners",
  viewAction: "View cleaner",
} as const;

export const defaultAdminCleanerFilters: AdminCleanerFilters = {
  query: "",
  status: "",
};

export const emptyAdminCleanerFilterCatalog: AdminCleanerFilterCatalog = {
  statuses: [],
};

export const adminCleanerFilterCatalog: AdminCleanerFilterCatalog = {
  statuses: [
    { id: "ACTIVE", label: "Active" },
    { id: "INVITED", label: "Invitation pending" },
    { id: "INACTIVE", label: "Inactive" },
  ],
};

export function getAdminCleanerJobsPath(cleanerId: string): string {
  return `${ADMIN_PATHS.bookings}?cleanerId=${encodeURIComponent(cleanerId)}`;
}

export function getAdminCleanerSchedulePath(cleanerId: string): string {
  return getAdminCleanerJobsPath(cleanerId);
}

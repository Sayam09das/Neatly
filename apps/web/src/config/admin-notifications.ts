import { ADMIN_PATHS } from "@/config/admin-nav";
import type {
  AdminNotificationFilterCatalog,
  AdminNotificationFilters,
} from "@/types/admin-notification";

export const adminNotificationCopy = {
  actionsLabel: "Open notification actions",
  clearFilters: "Clear filters",
  closeFiltersLabel: "Close filters",
  comingSoonHint: "Coming soon",
  description: "Stay up to date with important activity across Neatly.",
  emptyDescription: "Important activity and updates will appear here.",
  emptyTitle: "No notifications yet",
  emptyValue: "—",
  errorDescription: "Notifications could not be shown. You can try again.",
  errorTitle: "Unable to load notifications",
  filterSheetDescription: "Narrow notifications by read state.",
  filterSheetTitle: "Filters",
  filtersLabel: "Filters",
  heading: "Notifications",
  loadingLabel: "Loading notifications",
  markAllAction: "Mark all as read",
  markAllError: "Unable to mark notifications as read.",
  markAllSuccess: "Notifications marked as read.",
  markReadAction: "Mark as read",
  markReadError: "Unable to mark notification as read.",
  markReadSuccess: "Notification marked as read.",
  noMatchesDescription:
    "No notifications match the current filters. Clear filters to reset the list.",
  noMatchesTitle: "No matching notifications",
  paginationLabel: "Notifications pagination",
  paginationNext: "Next",
  paginationPageLabel: "Page",
  paginationPrevious: "Previous",
  readLabel: "Read",
  readStateAll: "All",
  readStateLabel: "Status",
  retryLabel: "Try again",
  searchLabel: "Search notifications",
  searchPlaceholder: "Search notifications...",
  title: "Notifications",
  unreadLabel: "Unread",
  viewRelatedAction: "View related",
} as const;

export const defaultAdminNotificationFilters: AdminNotificationFilters = {
  query: "",
  readState: "",
};

export const adminNotificationFilterCatalog: AdminNotificationFilterCatalog = {
  readStates: [
    { id: "unread", label: adminNotificationCopy.unreadLabel },
    { id: "read", label: adminNotificationCopy.readLabel },
  ],
};

export function getAdminNotificationsPath(): string {
  return ADMIN_PATHS.notifications;
}

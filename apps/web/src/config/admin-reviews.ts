import { ADMIN_PATHS } from "@/config/admin-nav";
import type {
  AdminReviewFilterCatalog,
  AdminReviewFilters,
  AdminReviewServiceCategory,
  AdminReviewStatus,
} from "@/types/admin-review";

export const ADMIN_REVIEW_DETAILS_PATH = `${ADMIN_PATHS.reviews}/[id]`;
export const ADMIN_REVIEW_PREVIEW_LENGTH = 160;

export const adminReviewStatusLabels: Record<AdminReviewStatus, string> = {
  active: "Active",
  inactive: "Inactive",
};

export const adminReviewCategoryLabels: Record<
  AdminReviewServiceCategory,
  string
> = {
  COMMERCIAL: "Commercial",
  DEEP_CLEAN: "Deep clean",
  MOVE_IN_OUT: "Move-in / Move-out",
  RESIDENTIAL: "Residential",
};

export const adminReviewCopy = {
  actionsLabel: "Open review actions",
  categoryAll: "All categories",
  categoryLabel: "Service category",
  clearFilters: "Clear filters",
  closeFiltersLabel: "Close filters",
  comingSoonHint: "Coming soon",
  confirmCancel: "Cancel",
  confirmDeleteAction: "Confirm",
  confirmDeleteDescription:
    "This action cannot be undone. Deletion is not available until backend integration is complete.",
  confirmDeleteTitle: "Are you sure?",
  createdFromLabel: "From",
  createdToLabel: "To",
  deleteAction: "Delete review",
  description: "Review customer feedback and keep service quality visible.",
  editAction: "Edit review",
  emptyDescription:
    "Customer reviews will appear here once feedback is submitted.",
  emptyTitle: "No reviews yet",
  emptyValue: "—",
  errorDescription: "Reviews could not be shown. You can try again.",
  errorTitle: "Unable to load reviews",
  filterDateLabel: "Date",
  filterSheetDescription:
    "Narrow reviews by rating, status, category, and date.",
  filterSheetTitle: "Filters",
  filtersLabel: "Filters",
  heading: "Reviews",
  hideAction: "Hide review",
  loadingLabel: "Loading reviews",
  noMatchesDescription:
    "No reviews match the current filters. Clear filters to reset the list.",
  noMatchesTitle: "No matching reviews",
  paginationLabel: "Reviews pagination",
  paginationNext: "Next",
  paginationPageLabel: "Page",
  paginationPrevious: "Previous",
  ratingAll: "All ratings",
  ratingLabel: "Rating",
  readLess: "Show less",
  readMore: "Read more",
  retryLabel: "Try again",
  searchLabel: "Search reviews",
  searchPlaceholder: "Search reviews...",
  statusAll: "All statuses",
  statusLabel: "Status",
  summaryAverage: "Average rating",
  summaryDistribution: "Rating distribution",
  summaryEmpty: "Review totals will appear here once feedback is available.",
  summaryTitle: "Review summary",
  summaryTotal: "Total reviews",
  tableActions: "Actions",
  tableDate: "Date",
  tableLabel: "Reviews",
  tableRating: "Rating",
  tableRelated: "Related service",
  tableReview: "Review",
  tableReviewer: "Reviewer",
  tableStatus: "Status",
  title: "Reviews",
  viewAction: "View review",
} as const;

export const defaultAdminReviewFilters: AdminReviewFilters = {
  category: "",
  createdFrom: "",
  createdTo: "",
  query: "",
  rating: "",
  status: "",
};

export const adminReviewFilterCatalog: AdminReviewFilterCatalog = {
  categories: [
    { id: "RESIDENTIAL", label: adminReviewCategoryLabels.RESIDENTIAL },
    { id: "DEEP_CLEAN", label: adminReviewCategoryLabels.DEEP_CLEAN },
    { id: "MOVE_IN_OUT", label: adminReviewCategoryLabels.MOVE_IN_OUT },
    { id: "COMMERCIAL", label: adminReviewCategoryLabels.COMMERCIAL },
  ],
  ratings: [
    { id: "5", label: "5 stars" },
    { id: "4", label: "4 stars" },
    { id: "3", label: "3 stars" },
    { id: "2", label: "2 stars" },
    { id: "1", label: "1 star" },
  ],
  statuses: [
    { id: "active", label: adminReviewStatusLabels.active },
    { id: "inactive", label: adminReviewStatusLabels.inactive },
  ],
};

export function getAdminReviewDetailsPath(reviewId: string): string {
  return `${ADMIN_PATHS.reviews}/${reviewId}`;
}

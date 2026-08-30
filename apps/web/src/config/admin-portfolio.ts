import { ADMIN_PATHS } from "@/config/admin-nav";
import {
  ADMIN_PORTFOLIO_DATE_RANGE_ALL,
  ADMIN_PORTFOLIO_VISIBILITY_ALL,
  type AdminPortfolioCategory,
  type AdminPortfolioDateRange,
  type AdminPortfolioFilters,
  type AdminPortfolioVisibility,
  adminPortfolioCategories,
  adminPortfolioDateRanges,
  adminPortfolioVisibilities,
} from "@/types/admin-portfolio";

export const ADMIN_PORTFOLIO_DETAILS_PATH = `${ADMIN_PATHS.portfolio}/[id]`;

export const adminPortfolioCopy = {
  actionsLabel: "Open portfolio actions",
  backToPortfolio: "Back to portfolio",
  categoryAll: "All categories",
  categoryLabel: "Category",
  clearFilters: "Clear filters",
  closeFiltersLabel: "Close filters",
  comingSoonHint: "Actions",
  createAction: "New project",
  createUnavailable: "Creating portfolio projects is not available yet.",
  dateFromLabel: "From",
  dateRangeLabel: "Date",
  dateToLabel: "To",
  description: "Manage before-and-after project work shown on the public site.",
  descriptionLabel: "Description",
  detailsDescription: "Review the project details and current visibility.",
  detailsHeading: "Portfolio project",
  detailsNotFoundDescription:
    "This portfolio project is not available. Return to the portfolio list.",
  detailsNotFoundTitle: "Project not found",
  detailsTitle: "Portfolio",
  editAction: "Edit project",
  emptyDescription:
    "Completed project case studies will appear here once added.",
  emptyTitle: "No portfolio projects yet",
  emptyValue: "—",
  errorDescription: "We couldn't load portfolio projects.",
  errorTitle: "Unable to load portfolio",
  featuredLabel: "Featured",
  featuredNo: "Not featured",
  featuredYes: "Featured",
  filterSheetDescription:
    "Narrow portfolio projects by category, visibility, and date.",
  filterSheetTitle: "Filters",
  filtersLabel: "Filters",
  heading: "Portfolio",
  imagesEmpty: "No project images have been added.",
  imagesSection: "Images",
  loadingLabel: "Loading portfolio",
  locationLabel: "Location",
  metricFeatured: "Featured",
  metricPublished: "Published",
  metricTotal: "Total projects",
  metricUnpublished: "Unpublished",
  noMatchesDescription: "Try adjusting your search or filters.",
  noMatchesTitle: "No projects found",
  paginationLabel: "Portfolio pagination",
  paginationNext: "Next",
  paginationPageLabel: "Page",
  paginationPrevious: "Previous",
  projectSection: "Project",
  retryLabel: "Try again",
  searchLabel: "Search portfolio",
  searchPlaceholder: "Search portfolio...",
  slugLabel: "Slug",
  sortOrderLabel: "Sort order",
  statusSection: "Visibility",
  tableActions: "Actions",
  tableCategory: "Category",
  tableCreated: "Created",
  tableFeatured: "Featured",
  tableLabel: "Portfolio projects",
  tableLocation: "Location",
  tableStatus: "Visibility",
  tableTitle: "Project",
  timelineCreated: "Created",
  timelineSection: "Timeline",
  timelineUpdated: "Updated",
  title: "Portfolio",
  viewAction: "View project",
  visibilityAll: "All",
  visibilityLabel: "Visibility",
  visibilityPublished: "Published",
  visibilityUnpublished: "Unpublished",
} as const;

export const adminPortfolioCategoryLabels: Record<
  AdminPortfolioCategory,
  string
> = {
  COMMERCIAL: "Commercial",
  DEEP_CLEAN: "Deep clean",
  MOVE_IN_OUT: "Move-in / move-out",
  RESIDENTIAL: "Residential",
};

export const adminPortfolioVisibilityLabels: Record<
  Exclude<AdminPortfolioVisibility, typeof ADMIN_PORTFOLIO_VISIBILITY_ALL>,
  string
> = {
  published: adminPortfolioCopy.visibilityPublished,
  unpublished: adminPortfolioCopy.visibilityUnpublished,
};

export const adminPortfolioDateRangeLabels: Record<
  AdminPortfolioDateRange,
  string
> = {
  all: "All dates",
  custom: "Custom date",
  month: "This month",
  today: "Today",
  week: "This week",
};

export const defaultAdminPortfolioFilters: AdminPortfolioFilters = {
  category: "",
  createdFrom: "",
  createdTo: "",
  dateRange: ADMIN_PORTFOLIO_DATE_RANGE_ALL,
  query: "",
  visibility: ADMIN_PORTFOLIO_VISIBILITY_ALL,
};

export const adminPortfolioCategoryFilterOptions = [
  {
    label: adminPortfolioCopy.categoryAll,
    value: "",
  },
  ...adminPortfolioCategories.map((category) => ({
    label: adminPortfolioCategoryLabels[category],
    value: category,
  })),
];

export const adminPortfolioVisibilityFilterOptions =
  adminPortfolioVisibilities.map((visibility) => ({
    label:
      visibility === ADMIN_PORTFOLIO_VISIBILITY_ALL
        ? adminPortfolioCopy.visibilityAll
        : adminPortfolioVisibilityLabels[visibility],
    value: visibility,
  }));

export const adminPortfolioDateRangeFilterOptions =
  adminPortfolioDateRanges.map((range) => ({
    label: adminPortfolioDateRangeLabels[range],
    value: range,
  }));

export function getAdminPortfolioDetailsPath(projectId: string): string {
  return `${ADMIN_PATHS.portfolio}/${projectId}`;
}

import { ADMIN_PATHS } from "@/config/admin-nav";
import {
  ADMIN_BLOG_DATE_RANGE_ALL,
  ADMIN_BLOG_STATUS_ALL,
  type AdminBlogDateRange,
  type AdminBlogFilters,
  type AdminBlogStatus,
  adminBlogDateRanges,
  adminBlogStatuses,
} from "@/types/admin-blog";

export const ADMIN_BLOG_DETAILS_PATH = `${ADMIN_PATHS.blog}/[id]`;
export const ADMIN_BLOG_EXCERPT_PREVIEW_LENGTH = 80;

export const adminBlogCopy = {
  actionsLabel: "Open blog actions",
  backToBlog: "Back to blog",
  categoryLabel: "Category",
  clearFilters: "Clear filters",
  closeFiltersLabel: "Close filters",
  comingSoonHint: "Actions",
  contentSection: "Content",
  createAction: "New post",
  createUnavailable: "Creating blog posts is not available yet.",
  dateFromLabel: "From",
  dateRangeLabel: "Date",
  dateToLabel: "To",
  description: "Write and publish articles for the public blog.",
  detailsDescription: "Review the article details and current publish status.",
  detailsHeading: "Blog post",
  detailsNotFoundDescription:
    "This blog post is not available. Return to the blog list.",
  detailsNotFoundTitle: "Post not found",
  detailsTitle: "Blog",
  editAction: "Edit post",
  emptyDescription: "Blog articles will appear here once drafted or published.",
  emptyTitle: "No blog posts yet",
  emptyValue: "—",
  errorDescription: "We couldn't load blog posts.",
  errorTitle: "Unable to load blog",
  excerptLabel: "Excerpt",
  filterSheetDescription: "Narrow blog posts by status and date.",
  filterSheetTitle: "Filters",
  filtersLabel: "Filters",
  heading: "Blog",
  loadingLabel: "Loading blog",
  metricArchived: "Archived",
  metricDraft: "Draft",
  metricPublished: "Published",
  metricTotal: "Total posts",
  noMatchesDescription: "Try adjusting your search or filters.",
  noMatchesTitle: "No posts found",
  paginationLabel: "Blog pagination",
  paginationNext: "Next",
  paginationPageLabel: "Page",
  paginationPrevious: "Previous",
  postSection: "Article",
  publishedLabel: "Published",
  retryLabel: "Try again",
  searchLabel: "Search blog",
  searchPlaceholder: "Search blog...",
  seoDescriptionLabel: "SEO description",
  seoSection: "SEO",
  seoTitleLabel: "SEO title",
  slugLabel: "Slug",
  statusAll: "All",
  statusLabel: "Status",
  statusSection: "Post status",
  tableActions: "Actions",
  tableCategory: "Category",
  tableCreated: "Created",
  tableLabel: "Blog posts",
  tablePublished: "Published",
  tableStatus: "Status",
  tableTitle: "Title",
  tagsEmpty: "No tags were added.",
  tagsLabel: "Tags",
  timelineCreated: "Created",
  timelineSection: "Timeline",
  timelineUpdated: "Updated",
  title: "Blog",
  viewAction: "View post",
} as const;

export const adminBlogStatusLabels: Record<AdminBlogStatus, string> = {
  ARCHIVED: "Archived",
  DRAFT: "Draft",
  PUBLISHED: "Published",
};

export const adminBlogDateRangeLabels: Record<AdminBlogDateRange, string> = {
  all: "All dates",
  custom: "Custom date",
  month: "This month",
  today: "Today",
  week: "This week",
};

export const defaultAdminBlogFilters: AdminBlogFilters = {
  createdFrom: "",
  createdTo: "",
  dateRange: ADMIN_BLOG_DATE_RANGE_ALL,
  query: "",
  status: ADMIN_BLOG_STATUS_ALL,
};

export const adminBlogStatusFilterOptions = [
  {
    label: adminBlogCopy.statusAll,
    value: ADMIN_BLOG_STATUS_ALL,
  },
  ...adminBlogStatuses.map((status) => ({
    label: adminBlogStatusLabels[status],
    value: status,
  })),
];

export const adminBlogDateRangeFilterOptions = adminBlogDateRanges.map(
  (range) => ({
    label: adminBlogDateRangeLabels[range],
    value: range,
  }),
);

export function getAdminBlogDetailsPath(postId: string): string {
  return `${ADMIN_PATHS.blog}/${postId}`;
}

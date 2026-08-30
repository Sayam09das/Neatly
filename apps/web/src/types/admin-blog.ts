export const ADMIN_BLOG_STATUS_ALL = "all" as const;

export const adminBlogStatuses = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;

export type AdminBlogStatus = (typeof adminBlogStatuses)[number];

export type AdminBlogStatusFilter =
  | typeof ADMIN_BLOG_STATUS_ALL
  | AdminBlogStatus;

export const ADMIN_BLOG_DATE_RANGE_ALL = "all" as const;

export const adminBlogDateRanges = [
  "all",
  "today",
  "week",
  "month",
  "custom",
] as const;

export type AdminBlogDateRange = (typeof adminBlogDateRanges)[number];

export interface AdminBlogPost {
  authorId: string;
  categoryId: string | null;
  categoryName: string | null;
  content: string;
  createdAt: string;
  excerpt: string;
  id: string;
  publishedAt: string | null;
  seoDescription: string | null;
  seoTitle: string | null;
  slug: string;
  status: AdminBlogStatus;
  tags: readonly string[];
  title: string;
  updatedAt: string;
}

export interface AdminBlogFilters {
  createdFrom: string;
  createdTo: string;
  dateRange: AdminBlogDateRange;
  query: string;
  status: AdminBlogStatusFilter;
}

export interface AdminBlogPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export type AdminBlogPresentation =
  | { status: "loading" }
  | { status: "empty" }
  | { onRetry: () => void; status: "error" }
  | {
      pagination?: AdminBlogPagination;
      posts: readonly AdminBlogPost[];
      status: "ready";
    };

export type AdminBlogDetailsPresentation =
  | { status: "loading" }
  | { status: "empty" }
  | { onRetry: () => void; status: "error" }
  | { post: AdminBlogPost; status: "ready" };

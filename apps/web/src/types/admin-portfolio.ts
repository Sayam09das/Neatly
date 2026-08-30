export const ADMIN_PORTFOLIO_VISIBILITY_ALL = "all" as const;

export const adminPortfolioVisibilities = [
  "all",
  "published",
  "unpublished",
] as const;

export type AdminPortfolioVisibility =
  (typeof adminPortfolioVisibilities)[number];

export const adminPortfolioCategories = [
  "RESIDENTIAL",
  "DEEP_CLEAN",
  "MOVE_IN_OUT",
  "COMMERCIAL",
] as const;

export type AdminPortfolioCategory = (typeof adminPortfolioCategories)[number];

export const ADMIN_PORTFOLIO_DATE_RANGE_ALL = "all" as const;

export const adminPortfolioDateRanges = [
  "all",
  "today",
  "week",
  "month",
  "custom",
] as const;

export type AdminPortfolioDateRange = (typeof adminPortfolioDateRanges)[number];

export interface AdminPortfolioProject {
  category: AdminPortfolioCategory;
  createdAt: string;
  description: string;
  id: string;
  isFeatured: boolean;
  isPublished: boolean;
  location: string | null;
  slug: string;
  sortOrder: number;
  title: string;
  updatedAt: string;
}

export interface AdminPortfolioFilters {
  category: string;
  createdFrom: string;
  createdTo: string;
  dateRange: AdminPortfolioDateRange;
  query: string;
  visibility: AdminPortfolioVisibility;
}

export interface AdminPortfolioPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export type AdminPortfolioPresentation =
  | { status: "loading" }
  | { status: "empty" }
  | { onRetry: () => void; status: "error" }
  | {
      pagination?: AdminPortfolioPagination;
      projects: readonly AdminPortfolioProject[];
      status: "ready";
    };

export type AdminPortfolioDetailsPresentation =
  | { status: "loading" }
  | { status: "empty" }
  | { onRetry: () => void; status: "error" }
  | { project: AdminPortfolioProject; status: "ready" };

export type AdminReviewStatus = "active" | "inactive";

export type AdminReviewServiceCategory =
  | "COMMERCIAL"
  | "DEEP_CLEAN"
  | "MOVE_IN_OUT"
  | "RESIDENTIAL";

export type AdminReviewRatingValue = 1 | 2 | 3 | 4 | 5;

export interface AdminReview {
  content: string | null;
  createdAt: string | null;
  customerName: string | null;
  customerRole: string | null;
  id: string;
  isActive: boolean | null;
  isFeatured: boolean | null;
  rating: AdminReviewRatingValue | null;
  serviceCategory: AdminReviewServiceCategory | null;
}

export interface AdminReviewFilters {
  category: string;
  createdFrom: string;
  createdTo: string;
  query: string;
  rating: string;
  status: string;
}

export interface AdminReviewPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface AdminReviewFilterOption {
  id: string;
  label: string;
}

export interface AdminReviewFilterCatalog {
  categories: readonly AdminReviewFilterOption[];
  ratings: readonly AdminReviewFilterOption[];
  statuses: readonly AdminReviewFilterOption[];
}

export type AdminReviewPresentation =
  | { status: "loading" }
  | { status: "empty" }
  | { onRetry: () => void; status: "error" }
  | {
      pagination?: AdminReviewPagination;
      reviews: readonly AdminReview[];
      status: "ready";
    };

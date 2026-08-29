import {
  ADMIN_API_PATHS,
  ADMIN_LIST_PAGE_SIZE,
  withAdminApiId,
} from "@/config/admin-api";
import {
  ADMIN_REVIEW_PREVIEW_LENGTH,
  adminReviewCategoryLabels,
  adminReviewCopy,
  adminReviewStatusLabels,
} from "@/config/admin-reviews";
import { mapAdminResult } from "@/lib/admin/parse-result";
import {
  isRecord,
  mapAdminPagination,
  readBoolean,
  readIsoDate,
  readNullableString,
  readNumber,
  readString,
  withAdminQuery,
} from "@/lib/admin/query";
import { type AdminApiResult, adminRequest } from "@/lib/api/admin-request";
import type {
  AdminReview,
  AdminReviewFilters,
  AdminReviewPagination,
  AdminReviewRatingValue,
  AdminReviewServiceCategory,
  AdminReviewStatus,
} from "@/types/admin-review";

const DATE_ONLY_PATTERN = /^(\d{4}-\d{2}-\d{2})/;

export function hasActiveReviewFilters(filters: AdminReviewFilters): boolean {
  return (
    filters.query.trim() !== "" ||
    filters.rating !== "" ||
    filters.status !== "" ||
    filters.category !== "" ||
    filters.createdFrom !== "" ||
    filters.createdTo !== ""
  );
}

export function filterReviews(
  reviews: readonly AdminReview[],
  filters: AdminReviewFilters,
): readonly AdminReview[] {
  const query = filters.query.trim().toLowerCase();

  return reviews.filter((review): boolean => {
    if (
      filters.rating !== "" &&
      String(review.rating ?? "") !== filters.rating
    ) {
      return false;
    }

    if (
      filters.status !== "" &&
      getReviewStatus(review.isActive) !== filters.status
    ) {
      return false;
    }

    if (
      filters.category !== "" &&
      review.serviceCategory !== filters.category
    ) {
      return false;
    }

    if (!matchesCreatedRange(review.createdAt, filters)) {
      return false;
    }

    if (query === "") {
      return true;
    }

    const haystack = [
      review.id,
      review.customerName ?? "",
      review.content ?? "",
      review.customerRole ?? "",
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
}

export function getReviewStatus(
  isActive: boolean | null,
): AdminReviewStatus | null {
  if (isActive === null) {
    return null;
  }

  return isActive ? "active" : "inactive";
}

export function getReviewStatusLabel(isActive: boolean | null): string {
  const status = getReviewStatus(isActive);

  if (status === null) {
    return adminReviewCopy.emptyValue;
  }

  return adminReviewStatusLabels[status];
}

export function getReviewerLabel(name: string | null): string {
  if (name === null || name.trim() === "") {
    return adminReviewCopy.emptyValue;
  }

  return name;
}

export function getReviewContentLabel(content: string | null): string {
  if (content === null || content.trim() === "") {
    return adminReviewCopy.emptyValue;
  }

  return content;
}

export function getReviewPreview(content: string | null): {
  isCollapsed: boolean;
  text: string;
} {
  const label = getReviewContentLabel(content);

  if (label === adminReviewCopy.emptyValue) {
    return { isCollapsed: false, text: label };
  }

  if (label.length <= ADMIN_REVIEW_PREVIEW_LENGTH) {
    return { isCollapsed: false, text: label };
  }

  return {
    isCollapsed: true,
    text: `${label.slice(0, ADMIN_REVIEW_PREVIEW_LENGTH).trimEnd()}…`,
  };
}

export function getReviewCategoryLabel(
  category: AdminReviewServiceCategory | null,
): string {
  if (category === null) {
    return adminReviewCopy.emptyValue;
  }

  return adminReviewCategoryLabels[category];
}

export function getReviewRatingLabel(
  rating: AdminReviewRatingValue | null,
): string {
  if (rating === null) {
    return adminReviewCopy.emptyValue;
  }

  return `${String(rating)} out of 5 stars`;
}

export function formatReviewDate(isoDateTime: string | null): string {
  if (isoDateTime === null || isoDateTime === "") {
    return adminReviewCopy.emptyValue;
  }

  const date = new Date(isoDateTime);

  if (Number.isNaN(date.getTime())) {
    return adminReviewCopy.emptyValue;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  }).format(date);
}

export function formatReviewDateInput(isoDate: string): string {
  if (isoDate === "") {
    return "";
  }

  const date = new Date(`${isoDate}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  }).format(date);
}

export function formatReviewDateChip(
  filters: AdminReviewFilters,
): string | null {
  if (filters.createdFrom === "" && filters.createdTo === "") {
    return null;
  }

  if (filters.createdFrom !== "" && filters.createdTo !== "") {
    return `${formatReviewDateInput(filters.createdFrom)} – ${formatReviewDateInput(filters.createdTo)}`;
  }

  if (filters.createdFrom !== "") {
    return formatReviewDateInput(filters.createdFrom);
  }

  return formatReviewDateInput(filters.createdTo);
}

export function shouldRenderReviewPagination(
  pagination: AdminReviewPagination | undefined,
  visibleCount: number,
): boolean {
  return (
    pagination !== undefined &&
    pagination.total > 0 &&
    pagination.totalPages > 1 &&
    visibleCount > 0
  );
}

export interface AdminReviewList {
  pagination: AdminReviewPagination;
  reviews: readonly AdminReview[];
}

export interface AdminReviewListQuery extends AdminReviewFilters {
  page: number;
}

export async function listAdminReviews(
  query: AdminReviewListQuery,
  init: RequestInit = {},
): Promise<AdminApiResult<AdminReviewList>> {
  const result = await adminRequest<unknown>(
    withAdminQuery(ADMIN_API_PATHS.reviews, {
      filters: {
        active:
          query.status === "active"
            ? true
            : query.status === "inactive"
              ? false
              : undefined,
        category: query.category,
        createdFrom: query.createdFrom,
        createdTo: query.createdTo,
        rating: query.rating === "" ? undefined : Number(query.rating),
      },
      limit: ADMIN_LIST_PAGE_SIZE,
      page: query.page,
      search: query.query,
    }),
    init,
  );
  return mapAdminResult(result, mapReviewList);
}

export async function getAdminReview(
  id: string,
  init: RequestInit = {},
): Promise<AdminApiResult<AdminReview>> {
  const result = await adminRequest<unknown>(
    withAdminApiId(ADMIN_API_PATHS.review, id),
    init,
  );
  return mapAdminResult(result, (value) => {
    if (!isRecord(value)) {
      return null;
    }

    return mapReview(value.review ?? value);
  });
}

function mapReviewList(value: unknown): AdminReviewList | null {
  if (!isRecord(value) || !Array.isArray(value.items)) {
    return null;
  }

  const pagination = mapAdminPagination(value.pagination, ADMIN_LIST_PAGE_SIZE);

  if (pagination === null) {
    return null;
  }

  const reviews: AdminReview[] = [];

  for (const item of value.items) {
    const review = mapReview(item);

    if (review === null) {
      return null;
    }

    reviews.push(review);
  }

  return { pagination, reviews };
}

function mapReview(value: unknown): AdminReview | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = readString(value.id);

  if (id === null) {
    return null;
  }

  const rating = readNumber(value.rating);
  const category = readNullableString(value.serviceCategory);

  return {
    content: readNullableString(value.content),
    createdAt: readIsoDate(value.createdAt),
    customerName: readNullableString(value.customerName),
    customerRole: readNullableString(value.customerRole),
    id,
    isActive: readBoolean(value.isActive),
    isFeatured: readBoolean(value.isFeatured),
    rating: isReviewRating(rating) ? rating : null,
    serviceCategory: isReviewCategory(category) ? category : null,
  };
}

function isReviewRating(value: number | null): value is AdminReviewRatingValue {
  return (
    value === 1 || value === 2 || value === 3 || value === 4 || value === 5
  );
}

function isReviewCategory(
  value: string | null,
): value is AdminReviewServiceCategory {
  return (
    value === "COMMERCIAL" ||
    value === "DEEP_CLEAN" ||
    value === "MOVE_IN_OUT" ||
    value === "RESIDENTIAL"
  );
}

export function getReviewRatingCounts(
  reviews: readonly AdminReview[],
): Record<AdminReviewRatingValue, number> | null {
  if (reviews.length === 0) {
    return null;
  }

  const counts: Record<AdminReviewRatingValue, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  let rated = 0;

  for (const review of reviews) {
    if (review.rating === null) {
      continue;
    }

    counts[review.rating] += 1;
    rated += 1;
  }

  return rated === 0 ? null : counts;
}

export function getAverageReviewRating(
  reviews: readonly AdminReview[],
): number | null {
  const rated = reviews.filter(
    (review): review is AdminReview & { rating: AdminReviewRatingValue } => {
      return review.rating !== null;
    },
  );

  if (rated.length === 0) {
    return null;
  }

  const total = rated.reduce((sum, review) => sum + review.rating, 0);
  return total / rated.length;
}

function matchesCreatedRange(
  createdAt: string | null,
  filters: AdminReviewFilters,
): boolean {
  if (filters.createdFrom === "" && filters.createdTo === "") {
    return true;
  }

  if (createdAt === null) {
    return false;
  }

  const createdDate = extractDateOnly(createdAt);

  if (createdDate === null) {
    return false;
  }

  if (filters.createdFrom !== "" && createdDate < filters.createdFrom) {
    return false;
  }

  if (filters.createdTo !== "" && createdDate > filters.createdTo) {
    return false;
  }

  return true;
}

function extractDateOnly(value: string): string | null {
  const match = DATE_ONLY_PATTERN.exec(value);
  const date = match?.[1];
  return date === undefined ? null : date;
}

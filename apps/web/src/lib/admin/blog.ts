import { ADMIN_LIST_PAGE_SIZE } from "@/config/admin-api";
import {
  ADMIN_BLOG_EXCERPT_PREVIEW_LENGTH,
  adminBlogCopy,
  adminBlogDateRangeLabels,
  adminBlogStatusLabels,
} from "@/config/admin-blog";
import {
  ADMIN_BLOG_DATE_RANGE_ALL,
  ADMIN_BLOG_STATUS_ALL,
  type AdminBlogDateRange,
  type AdminBlogFilters,
  type AdminBlogPagination,
  type AdminBlogPost,
  type AdminBlogStatus,
  type AdminBlogStatusFilter,
  adminBlogDateRanges,
  adminBlogStatuses,
} from "@/types/admin-blog";

const MS_PER_DAY = 86_400_000;
const DAYS_IN_WEEK = 7;

export interface AdminBlogDateBounds {
  end: Date;
  start: Date;
}

export interface AdminBlogMetricCounts {
  archived: number;
  draft: number;
  published: number;
  total: number;
}

export function hasActiveBlogFilters(filters: AdminBlogFilters): boolean {
  return (
    filters.query.trim() !== "" ||
    filters.status !== ADMIN_BLOG_STATUS_ALL ||
    filters.dateRange !== ADMIN_BLOG_DATE_RANGE_ALL ||
    filters.createdFrom !== "" ||
    filters.createdTo !== ""
  );
}

export function filterBlogPosts(
  posts: readonly AdminBlogPost[],
  filters: AdminBlogFilters,
  now: Date = new Date(),
): readonly AdminBlogPost[] {
  const query = filters.query.trim().toLowerCase();
  const range = resolveBlogDateBounds(filters, now);

  return posts.filter((post): boolean => {
    if (
      filters.status !== ADMIN_BLOG_STATUS_ALL &&
      post.status !== filters.status
    ) {
      return false;
    }

    if (!matchesCreatedRange(post.createdAt, range)) {
      return false;
    }

    if (query === "") {
      return true;
    }

    const haystack = [post.id, post.title, post.slug, post.excerpt]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
}

export function countBlogMetrics(
  posts: readonly AdminBlogPost[],
): AdminBlogMetricCounts {
  return {
    archived: countPostsByStatus(posts, "ARCHIVED"),
    draft: countPostsByStatus(posts, "DRAFT"),
    published: countPostsByStatus(posts, "PUBLISHED"),
    total: posts.length,
  };
}

export function resolveBlogDateBounds(
  filters: AdminBlogFilters,
  now: Date = new Date(),
): AdminBlogDateBounds | null {
  if (filters.dateRange === "custom") {
    return resolveCustomDateBounds(filters.createdFrom, filters.createdTo);
  }

  if (filters.dateRange === "today") {
    return { end: endOfLocalDay(now), start: startOfLocalDay(now) };
  }

  if (filters.dateRange === "week") {
    const start = startOfLocalDay(now);
    start.setTime(start.getTime() - (DAYS_IN_WEEK - 1) * MS_PER_DAY);
    return { end: endOfLocalDay(now), start };
  }

  if (filters.dateRange === "month") {
    return { end: endOfLocalDay(now), start: startOfLocalMonth(now) };
  }

  return null;
}

export function formatBlogDateFilterChip(
  filters: AdminBlogFilters,
): string | null {
  if (
    filters.dateRange === ADMIN_BLOG_DATE_RANGE_ALL &&
    filters.createdFrom === "" &&
    filters.createdTo === ""
  ) {
    return null;
  }

  if (filters.dateRange !== "custom" && filters.dateRange !== "all") {
    return adminBlogDateRangeLabels[filters.dateRange];
  }

  if (filters.createdFrom === "" && filters.createdTo === "") {
    return null;
  }

  if (filters.createdFrom !== "" && filters.createdTo !== "") {
    return `${formatDateInput(filters.createdFrom)} – ${formatDateInput(filters.createdTo)}`;
  }

  return formatDateInput(
    filters.createdFrom !== "" ? filters.createdFrom : filters.createdTo,
  );
}

export function formatBlogInstant(
  isoDateTime: string | null,
  options: Intl.DateTimeFormatOptions,
): string {
  if (isoDateTime === null || isoDateTime.trim() === "") {
    return adminBlogCopy.emptyValue;
  }

  const date = new Date(isoDateTime);

  if (Number.isNaN(date.getTime())) {
    return adminBlogCopy.emptyValue;
  }

  return new Intl.DateTimeFormat(undefined, options).format(date);
}

export function getBlogStatusLabel(status: AdminBlogStatusFilter): string {
  if (status === ADMIN_BLOG_STATUS_ALL) {
    return adminBlogCopy.statusAll;
  }

  return adminBlogStatusLabels[status];
}

export function getBlogTitle(title: string): string {
  return title.trim() === "" ? adminBlogCopy.emptyValue : title;
}

export function getBlogCategoryLabel(categoryName: string | null): string {
  if (categoryName === null || categoryName.trim() === "") {
    return adminBlogCopy.emptyValue;
  }

  return categoryName;
}

export function getBlogExcerptPreview(excerpt: string): string {
  const trimmed = excerpt.trim();

  if (trimmed === "") {
    return adminBlogCopy.emptyValue;
  }

  if (trimmed.length <= ADMIN_BLOG_EXCERPT_PREVIEW_LENGTH) {
    return trimmed;
  }

  return `${trimmed.slice(0, ADMIN_BLOG_EXCERPT_PREVIEW_LENGTH).trimEnd()}…`;
}

export function getBlogTagsLabel(tags: readonly string[]): string {
  const visible = tags.map((tag) => tag.trim()).filter((tag) => tag !== "");

  if (visible.length === 0) {
    return adminBlogCopy.tagsEmpty;
  }

  return visible.join(", ");
}

export function shouldRenderBlogPagination(
  pagination: AdminBlogPagination | undefined,
  visibleCount: number,
): boolean {
  return (
    pagination !== undefined &&
    pagination.total > 0 &&
    pagination.totalPages > 1 &&
    visibleCount > 0
  );
}

export function paginateBlogPosts(
  posts: readonly AdminBlogPost[],
  page: number,
  pageSize: number = ADMIN_LIST_PAGE_SIZE,
): {
  pagination: AdminBlogPagination;
  posts: readonly AdminBlogPost[];
} {
  const total = posts.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    pagination: {
      page: safePage,
      pageSize,
      total,
      totalPages: total === 0 ? 0 : totalPages,
    },
    posts: posts.slice(start, start + pageSize),
  };
}

export function isAdminBlogStatus(value: string): value is AdminBlogStatus {
  return adminBlogStatuses.some((status) => status === value);
}

export function isAdminBlogDateRange(
  value: string,
): value is AdminBlogDateRange {
  return adminBlogDateRanges.some((range) => range === value);
}

function countPostsByStatus(
  posts: readonly AdminBlogPost[],
  status: AdminBlogStatus,
): number {
  return posts.filter((post) => post.status === status).length;
}

function matchesCreatedRange(
  createdAt: string,
  range: AdminBlogDateBounds | null,
): boolean {
  if (range === null) {
    return true;
  }

  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return (
    date.getTime() >= range.start.getTime() &&
    date.getTime() <= range.end.getTime()
  );
}

function resolveCustomDateBounds(
  from: string,
  to: string,
): AdminBlogDateBounds | null {
  if (from === "" && to === "") {
    return null;
  }

  const start =
    from === "" ? null : startOfLocalDay(new Date(`${from}T00:00:00`));
  const end = to === "" ? null : endOfLocalDay(new Date(`${to}T00:00:00`));

  if (start !== null && Number.isNaN(start.getTime())) {
    return null;
  }

  if (end !== null && Number.isNaN(end.getTime())) {
    return null;
  }

  if (start === null && end === null) {
    return null;
  }

  return {
    end: end ?? endOfLocalDay(start ?? new Date()),
    start: start ?? startOfLocalDay(end ?? new Date()),
  };
}

function formatDateInput(isoDate: string): string {
  if (isoDate === "") {
    return "";
  }

  const date = new Date(`${isoDate}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
    date,
  );
}

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function endOfLocalDay(date: Date): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999,
  );
}

function startOfLocalMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

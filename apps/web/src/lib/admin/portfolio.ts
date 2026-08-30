import { ADMIN_LIST_PAGE_SIZE } from "@/config/admin-api";
import {
  adminPortfolioCategoryLabels,
  adminPortfolioCopy,
  adminPortfolioDateRangeLabels,
} from "@/config/admin-portfolio";
import {
  ADMIN_PORTFOLIO_DATE_RANGE_ALL,
  ADMIN_PORTFOLIO_VISIBILITY_ALL,
  type AdminPortfolioCategory,
  type AdminPortfolioDateRange,
  type AdminPortfolioFilters,
  type AdminPortfolioPagination,
  type AdminPortfolioProject,
  type AdminPortfolioVisibility,
  adminPortfolioCategories,
  adminPortfolioDateRanges,
  adminPortfolioVisibilities,
} from "@/types/admin-portfolio";

const MS_PER_DAY = 86_400_000;
const DAYS_IN_WEEK = 7;

export interface AdminPortfolioDateBounds {
  end: Date;
  start: Date;
}

export interface AdminPortfolioMetricCounts {
  featured: number;
  published: number;
  total: number;
  unpublished: number;
}

export function hasActivePortfolioFilters(
  filters: AdminPortfolioFilters,
): boolean {
  return (
    filters.query.trim() !== "" ||
    filters.category !== "" ||
    filters.visibility !== ADMIN_PORTFOLIO_VISIBILITY_ALL ||
    filters.dateRange !== ADMIN_PORTFOLIO_DATE_RANGE_ALL ||
    filters.createdFrom !== "" ||
    filters.createdTo !== ""
  );
}

export function filterPortfolioProjects(
  projects: readonly AdminPortfolioProject[],
  filters: AdminPortfolioFilters,
  now: Date = new Date(),
): readonly AdminPortfolioProject[] {
  const query = filters.query.trim().toLowerCase();
  const range = resolvePortfolioDateBounds(filters, now);

  return projects.filter((project): boolean => {
    if (filters.category !== "" && project.category !== filters.category) {
      return false;
    }

    if (filters.visibility === "published" && project.isPublished === false) {
      return false;
    }

    if (filters.visibility === "unpublished" && project.isPublished === true) {
      return false;
    }

    if (!matchesCreatedRange(project.createdAt, range)) {
      return false;
    }

    if (query === "") {
      return true;
    }

    const haystack = [
      project.id,
      project.title,
      project.slug,
      project.location ?? "",
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
}

export function countPortfolioMetrics(
  projects: readonly AdminPortfolioProject[],
): AdminPortfolioMetricCounts {
  return {
    featured: projects.filter((project) => project.isFeatured).length,
    published: projects.filter((project) => project.isPublished).length,
    total: projects.length,
    unpublished: projects.filter((project) => project.isPublished === false)
      .length,
  };
}

export function resolvePortfolioDateBounds(
  filters: AdminPortfolioFilters,
  now: Date = new Date(),
): AdminPortfolioDateBounds | null {
  return resolveDateBounds(
    filters.dateRange,
    filters.createdFrom,
    filters.createdTo,
    now,
  );
}

export function formatPortfolioDateFilterChip(
  filters: AdminPortfolioFilters,
): string | null {
  return formatDateFilterChip(
    filters.dateRange,
    filters.createdFrom,
    filters.createdTo,
  );
}

export function formatPortfolioInstant(
  isoDateTime: string,
  options: Intl.DateTimeFormatOptions,
): string {
  return formatInstant(isoDateTime, options, adminPortfolioCopy.emptyValue);
}

export function getPortfolioCategoryLabel(category: string): string {
  if (!isAdminPortfolioCategory(category)) {
    return adminPortfolioCopy.emptyValue;
  }

  return adminPortfolioCategoryLabels[category];
}

export function getPortfolioTitle(title: string): string {
  return title.trim() === "" ? adminPortfolioCopy.emptyValue : title;
}

export function getPortfolioLocation(location: string | null): string {
  if (location === null || location.trim() === "") {
    return adminPortfolioCopy.emptyValue;
  }

  return location;
}

export function getPortfolioVisibilityLabel(isPublished: boolean): string {
  return isPublished
    ? adminPortfolioCopy.visibilityPublished
    : adminPortfolioCopy.visibilityUnpublished;
}

export function getPortfolioFeaturedLabel(isFeatured: boolean): string {
  return isFeatured
    ? adminPortfolioCopy.featuredYes
    : adminPortfolioCopy.featuredNo;
}

export function shouldRenderPortfolioPagination(
  pagination: AdminPortfolioPagination | undefined,
  visibleCount: number,
): boolean {
  return (
    pagination !== undefined &&
    pagination.total > 0 &&
    pagination.totalPages > 1 &&
    visibleCount > 0
  );
}

export function paginatePortfolioProjects(
  projects: readonly AdminPortfolioProject[],
  page: number,
  pageSize: number = ADMIN_LIST_PAGE_SIZE,
): {
  pagination: AdminPortfolioPagination;
  projects: readonly AdminPortfolioProject[];
} {
  const total = projects.length;
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
    projects: projects.slice(start, start + pageSize),
  };
}

export function isAdminPortfolioCategory(
  value: string,
): value is AdminPortfolioCategory {
  return adminPortfolioCategories.some((category) => category === value);
}

export function isAdminPortfolioVisibility(
  value: string,
): value is AdminPortfolioVisibility {
  return adminPortfolioVisibilities.some((visibility) => visibility === value);
}

export function isAdminPortfolioDateRange(
  value: string,
): value is AdminPortfolioDateRange {
  return adminPortfolioDateRanges.some((range) => range === value);
}

function formatDateFilterChip(
  dateRange: AdminPortfolioDateRange,
  from: string,
  to: string,
): string | null {
  if (
    dateRange === ADMIN_PORTFOLIO_DATE_RANGE_ALL &&
    from === "" &&
    to === ""
  ) {
    return null;
  }

  if (dateRange !== "custom" && dateRange !== "all") {
    return adminPortfolioDateRangeLabels[dateRange];
  }

  if (from === "" && to === "") {
    return null;
  }

  if (from !== "" && to !== "") {
    return `${formatDateInput(from)} – ${formatDateInput(to)}`;
  }

  return formatDateInput(from !== "" ? from : to);
}

function resolveDateBounds(
  dateRange: AdminPortfolioDateRange,
  from: string,
  to: string,
  now: Date,
): AdminPortfolioDateBounds | null {
  if (dateRange === "custom") {
    return resolveCustomDateBounds(from, to);
  }

  if (dateRange === "today") {
    return { end: endOfLocalDay(now), start: startOfLocalDay(now) };
  }

  if (dateRange === "week") {
    const start = startOfLocalDay(now);
    start.setTime(start.getTime() - (DAYS_IN_WEEK - 1) * MS_PER_DAY);
    return { end: endOfLocalDay(now), start };
  }

  if (dateRange === "month") {
    return { end: endOfLocalDay(now), start: startOfLocalMonth(now) };
  }

  return null;
}

function matchesCreatedRange(
  createdAt: string,
  range: AdminPortfolioDateBounds | null,
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
): AdminPortfolioDateBounds | null {
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

function formatInstant(
  isoDateTime: string,
  options: Intl.DateTimeFormatOptions,
  emptyValue: string,
): string {
  if (isoDateTime.trim() === "") {
    return emptyValue;
  }

  const date = new Date(isoDateTime);

  if (Number.isNaN(date.getTime())) {
    return emptyValue;
  }

  return new Intl.DateTimeFormat(undefined, options).format(date);
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

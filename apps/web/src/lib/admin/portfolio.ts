import {
  ADMIN_API_PATHS,
  ADMIN_LIST_PAGE_SIZE,
  withAdminApiId,
} from "@/config/admin-api";
import {
  adminPortfolioCategoryLabels,
  adminPortfolioCopy,
  adminPortfolioDateRangeLabels,
} from "@/config/admin-portfolio";
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

export interface AdminPortfolioList {
  pagination: AdminPortfolioPagination;
  projects: readonly AdminPortfolioProject[];
}

export interface AdminPortfolioListQuery extends AdminPortfolioFilters {
  page: number;
}

export async function listAdminPortfolioProjects(
  query: AdminPortfolioListQuery,
  init: RequestInit = {},
): Promise<AdminApiResult<AdminPortfolioList>> {
  const bounds = resolvePortfolioDateBounds(query);

  const result = await adminRequest<unknown>(
    withAdminQuery(ADMIN_API_PATHS.portfolio, {
      filters: {
        category: query.category === "" ? undefined : query.category,
        createdFrom: bounds?.start.toISOString(),
        createdTo: bounds?.end.toISOString(),
        published:
          query.visibility === "published"
            ? true
            : query.visibility === "unpublished"
              ? false
              : undefined,
      },
      limit: ADMIN_LIST_PAGE_SIZE,
      page: query.page,
      search: query.query,
    }),
    init,
  );
  return mapAdminResult(result, mapPortfolioList);
}

export async function getAdminPortfolioProject(
  id: string,
  init: RequestInit = {},
): Promise<AdminApiResult<AdminPortfolioProject>> {
  const result = await adminRequest<unknown>(
    withAdminApiId(ADMIN_API_PATHS.portfolioProject, id),
    init,
  );
  return mapAdminResult(result, mapPortfolioPayload);
}

function mapPortfolioPayload(value: unknown): AdminPortfolioProject | null {
  if (!isRecord(value)) {
    return null;
  }

  return mapPortfolioProject(value.project ?? value);
}

function mapPortfolioList(value: unknown): AdminPortfolioList | null {
  if (!isRecord(value) || !Array.isArray(value.items)) {
    return null;
  }

  const pagination = mapAdminPagination(value.pagination, ADMIN_LIST_PAGE_SIZE);

  if (pagination === null) {
    return null;
  }

  const projects: AdminPortfolioProject[] = [];

  for (const item of value.items) {
    const project = mapPortfolioProject(item);

    if (project === null) {
      return null;
    }

    projects.push(project);
  }

  return { pagination, projects };
}

function mapPortfolioProject(value: unknown): AdminPortfolioProject | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = readString(value.id);
  const category = readString(value.category);
  const description = readString(value.description);
  const slug = readString(value.slug);
  const title = readString(value.title);
  const createdAt = readIsoDate(value.createdAt);
  const updatedAt = readIsoDate(value.updatedAt);
  const isFeatured = readBoolean(value.isFeatured);
  const isPublished = readBoolean(value.isPublished);
  const sortOrder = readNumber(value.sortOrder);

  if (
    id === null ||
    category === null ||
    description === null ||
    slug === null ||
    title === null ||
    createdAt === null ||
    updatedAt === null ||
    isFeatured === null ||
    isPublished === null ||
    sortOrder === null ||
    !isAdminPortfolioCategory(category)
  ) {
    return null;
  }

  return {
    category,
    createdAt,
    description,
    id,
    isFeatured,
    isPublished,
    location: readNullableString(value.location),
    slug,
    sortOrder,
    title,
    updatedAt,
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

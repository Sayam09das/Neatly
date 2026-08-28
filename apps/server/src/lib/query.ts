import {
  PAGINATION_DEFAULT_LIMIT,
  PAGINATION_DEFAULT_PAGE,
  PAGINATION_MAX_LIMIT,
  SORT_DIRECTIONS,
} from "../config/constants.ts";
import { ValidationError } from "./errors.ts";

export type SortDirection = (typeof SORT_DIRECTIONS)[number];

export interface PaginationQuery {
  limit: number;
  page: number;
  skip: number;
}

export interface PaginationMeta {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

export interface SortQuery {
  direction: SortDirection;
  field: string;
}

export function parsePagination(
  searchParams: URLSearchParams,
): PaginationQuery {
  const page = readPositiveInteger(
    searchParams.get("page"),
    "page",
    PAGINATION_DEFAULT_PAGE,
  );
  const requestedLimit = readPositiveInteger(
    searchParams.get("limit"),
    "limit",
    PAGINATION_DEFAULT_LIMIT,
  );
  const limit = Math.min(requestedLimit, PAGINATION_MAX_LIMIT);

  return {
    limit,
    page,
    skip: (page - 1) * limit,
  };
}

export function toPaginationMeta(
  total: number,
  pagination: PaginationQuery,
): PaginationMeta {
  const safeTotal = Math.max(total, 0);

  return {
    limit: pagination.limit,
    page: pagination.page,
    total: safeTotal,
    totalPages: Math.max(Math.ceil(safeTotal / pagination.limit), 0),
  };
}

export function parseSort(
  searchParams: URLSearchParams,
  allowedFields: readonly string[],
): SortQuery | undefined {
  const field = searchParams.get("sort")?.trim();

  if (field === undefined || field === "") {
    return undefined;
  }

  if (!allowedFields.includes(field)) {
    throw new ValidationError("Validation failed.", [
      { field: "sort", issue: "This sort field is not allowed." },
    ]);
  }

  const rawDirection = searchParams.get("order")?.trim().toLowerCase();
  const direction: SortDirection =
    rawDirection === undefined || rawDirection === ""
      ? "asc"
      : parseSortDirection(rawDirection);

  return { direction, field };
}

export function parseAllowedFilters(
  searchParams: URLSearchParams,
  allowedFields: readonly string[],
): Record<string, string> {
  const filters: Record<string, string> = {};
  const allowed = new Set(allowedFields);

  for (const field of allowed) {
    const value = searchParams.get(field)?.trim();

    if (value !== undefined && value !== "") {
      filters[field] = value;
    }
  }

  return filters;
}

function parseSortDirection(value: string): SortDirection {
  if (value === SORT_DIRECTIONS[0] || value === SORT_DIRECTIONS[1]) {
    return value;
  }

  throw new ValidationError("Validation failed.", [
    { field: "order", issue: "Use asc or desc." },
  ]);
}

function readPositiveInteger(
  value: string | null,
  field: string,
  fallback: number,
): number {
  if (value === null || value.trim() === "") {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);

  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new ValidationError("Validation failed.", [
      { field, issue: "Enter a positive whole number." },
    ]);
  }

  return parsed;
}

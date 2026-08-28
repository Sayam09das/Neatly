import type { SORT_DIRECTIONS } from "../config/constants.ts";
import { parseWithSchema, searchParamsToRecord } from "./validations/parse.ts";
import {
  createSortQuerySchema,
  paginationQuerySchema,
} from "./validations/primitives.ts";

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
  return parseWithSchema(
    paginationQuerySchema,
    searchParamsToRecord(searchParams),
  );
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
  return parseWithSchema(
    createSortQuerySchema(allowedFields),
    searchParamsToRecord(searchParams),
  );
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

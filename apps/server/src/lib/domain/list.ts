import {
  PAGINATION_DEFAULT_LIMIT,
  PAGINATION_DEFAULT_PAGE,
  PAGINATION_MAX_LIMIT,
  VALIDATION_FAILED_MESSAGE,
} from "../../config/constants.ts";
import { ValidationError } from "../errors.ts";
import {
  type PaginationMeta,
  type PaginationQuery,
  type SortQuery,
  toPaginationMeta,
} from "../query.ts";

export interface ListResult<T> {
  items: T[];
  pagination: PaginationMeta;
}

export interface DomainListQuery {
  pagination?: PaginationQuery;
  search?: string;
  sort?: SortQuery;
}

export function resolvePagination(
  pagination: PaginationQuery | undefined,
): PaginationQuery {
  const page = Math.max(pagination?.page ?? PAGINATION_DEFAULT_PAGE, 1);
  const limit = Math.min(
    Math.max(pagination?.limit ?? PAGINATION_DEFAULT_LIMIT, 1),
    PAGINATION_MAX_LIMIT,
  );

  return {
    limit,
    page,
    skip: (page - 1) * limit,
  };
}

export function resolveSort(
  sort: SortQuery | undefined,
  allowedFields: readonly string[],
): SortQuery | undefined {
  if (sort === undefined) {
    return undefined;
  }

  if (!allowedFields.includes(sort.field)) {
    throw new ValidationError(VALIDATION_FAILED_MESSAGE, [
      { field: "sort", issue: "This sort field is not allowed." },
    ]);
  }

  return sort;
}

export function toListResult<T>(
  items: readonly T[],
  total: number,
  pagination: PaginationQuery,
): ListResult<T> {
  return {
    items: [...items],
    pagination: toPaginationMeta(total, pagination),
  };
}

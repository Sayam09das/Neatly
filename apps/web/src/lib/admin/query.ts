export interface AdminListQueryInput {
  limit?: number;
  page?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
  filters?: Record<string, boolean | number | string | undefined>;
}

export function buildAdminSearchParams(
  input: AdminListQueryInput,
): URLSearchParams {
  const params = new URLSearchParams();

  if (input.page !== undefined) {
    params.set("page", String(input.page));
  }

  if (input.limit !== undefined) {
    params.set("limit", String(input.limit));
  }

  const search = input.search?.trim();

  if (search !== undefined && search !== "") {
    params.set("search", search);
  }

  if (input.sort !== undefined && input.sort !== "") {
    params.set("sort", input.sort);
  }

  if (input.order !== undefined) {
    params.set("order", input.order);
  }

  if (input.filters !== undefined) {
    for (const [key, value] of Object.entries(input.filters)) {
      if (value === undefined) {
        continue;
      }

      const serialized =
        typeof value === "string" ? value.trim() : String(value);

      if (serialized === "") {
        continue;
      }

      params.set(key, serialized);
    }
  }

  return params;
}

export function withAdminQuery(
  path: string,
  query: AdminListQueryInput,
): string {
  const params = buildAdminSearchParams(query);
  const encoded = params.toString();
  return encoded === "" ? path : `${path}?${encoded}`;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function readString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

export function readNullableString(value: unknown): string | null {
  if (value === null) {
    return null;
  }

  return readString(value);
}

export function readNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function readBoolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

export function readIsoDate(value: unknown): string | null {
  if (typeof value !== "string" || value.trim() === "") {
    return null;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString();
}

export interface AdminPaginationSource {
  limit?: unknown;
  page?: unknown;
  total?: unknown;
  totalPages?: unknown;
}

export function mapAdminPagination(
  value: unknown,
  fallbackLimit: number,
): {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
} | null {
  if (!isRecord(value)) {
    return null;
  }

  const page = readNumber(value.page);
  const limit = readNumber(value.limit);
  const total = readNumber(value.total);
  const totalPages = readNumber(value.totalPages);

  if (page === null || total === null || totalPages === null) {
    return null;
  }

  return {
    page,
    pageSize: limit ?? fallbackLimit,
    total,
    totalPages,
  };
}

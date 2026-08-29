import {
  ADMIN_API_PATHS,
  ADMIN_LIST_PAGE_SIZE,
  withAdminApiId,
} from "@/config/admin-api";
import { mapAdminResult } from "@/lib/admin/parse-result";
import {
  isRecord,
  mapAdminPagination,
  readNullableString,
  readString,
  withAdminQuery,
} from "@/lib/admin/query";
import { type AdminApiResult, adminRequest } from "@/lib/api/admin-request";

export interface AdminCleaner {
  email: string | null;
  id: string;
  name: string | null;
  phone: string | null;
  statusLabel: string | null;
}

export interface AdminCleanerPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface AdminCleanerList {
  cleaners: readonly AdminCleaner[];
  pagination: AdminCleanerPagination;
}

export interface AdminCleanerListQuery {
  page: number;
  query: string;
  status: string;
}

export async function listAdminCleaners(
  query: AdminCleanerListQuery,
  init: RequestInit = {},
): Promise<AdminApiResult<AdminCleanerList>> {
  const result = await adminRequest<unknown>(
    withAdminQuery(ADMIN_API_PATHS.cleaners, {
      filters: {
        status: query.status,
      },
      limit: ADMIN_LIST_PAGE_SIZE,
      page: query.page,
      search: query.query,
    }),
    init,
  );
  return mapAdminResult(result, mapCleanerList);
}

export async function getAdminCleaner(
  id: string,
  init: RequestInit = {},
): Promise<AdminApiResult<AdminCleaner>> {
  const result = await adminRequest<unknown>(
    withAdminApiId(ADMIN_API_PATHS.cleaner, id),
    init,
  );
  return mapAdminResult(result, (value) => {
    if (!isRecord(value)) {
      return null;
    }

    return mapCleaner(value.cleaner ?? value);
  });
}

function mapCleanerList(value: unknown): AdminCleanerList | null {
  if (!isRecord(value) || !Array.isArray(value.items)) {
    return null;
  }

  const pagination = mapAdminPagination(value.pagination, ADMIN_LIST_PAGE_SIZE);

  if (pagination === null) {
    return null;
  }

  const cleaners: AdminCleaner[] = [];

  for (const item of value.items) {
    const cleaner = mapCleaner(item);

    if (cleaner === null) {
      return null;
    }

    cleaners.push(cleaner);
  }

  return { cleaners, pagination };
}

function mapCleaner(value: unknown): AdminCleaner | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = readString(value.id);

  if (id === null) {
    return null;
  }

  const status = readNullableString(value.status);

  return {
    email: readNullableString(value.email),
    id,
    name: readNullableString(value.name),
    phone: readNullableString(value.phone),
    statusLabel:
      status === "ACTIVE"
        ? "Active"
        : status === "INACTIVE"
          ? "Inactive"
          : status,
  };
}

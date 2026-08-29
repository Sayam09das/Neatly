import {
  ADMIN_API_PATHS,
  ADMIN_LIST_PAGE_SIZE,
  withAdminApiId,
} from "@/config/admin-api";
import {
  adminServiceCopy,
  adminServiceStatusLabels,
} from "@/config/admin-services";
import { mapAdminResult } from "@/lib/admin/parse-result";
import {
  isRecord,
  mapAdminPagination,
  readBoolean,
  readNullableString,
  readString,
  withAdminQuery,
} from "@/lib/admin/query";
import { type AdminApiResult, adminRequest } from "@/lib/api/admin-request";
import type {
  AdminService,
  AdminServiceFilters,
  AdminServicePagination,
  AdminServiceStatus,
} from "@/types/admin-service";

export function hasActiveServiceFilters(filters: AdminServiceFilters): boolean {
  return filters.query.trim() !== "" || filters.status !== "";
}

export function filterServices(
  services: readonly AdminService[],
  filters: AdminServiceFilters,
): readonly AdminService[] {
  const query = filters.query.trim().toLowerCase();

  return services.filter((service): boolean => {
    if (
      filters.status !== "" &&
      getServiceStatus(service.isActive) !== filters.status
    ) {
      return false;
    }

    if (query === "") {
      return true;
    }

    const haystack = [
      service.id,
      service.name ?? "",
      service.slug ?? "",
      service.shortDescription ?? "",
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
}

export function getServiceStatus(
  isActive: boolean | null,
): AdminServiceStatus | null {
  if (isActive === null) {
    return null;
  }

  return isActive ? "active" : "inactive";
}

export function getServiceStatusLabel(isActive: boolean | null): string {
  const status = getServiceStatus(isActive);

  if (status === null) {
    return adminServiceCopy.emptyValue;
  }

  return adminServiceStatusLabels[status];
}

export function getServiceNameLabel(name: string | null): string {
  if (name === null || name.trim() === "") {
    return adminServiceCopy.emptyValue;
  }

  return name;
}

export function getServiceDescriptionLabel(
  shortDescription: string | null,
): string {
  if (shortDescription === null || shortDescription.trim() === "") {
    return adminServiceCopy.emptyValue;
  }

  return shortDescription;
}

export function getServiceSlugLabel(slug: string | null): string | null {
  if (slug === null || slug.trim() === "") {
    return null;
  }

  return slug;
}

export interface AdminServiceList {
  pagination: AdminServicePagination;
  services: readonly AdminService[];
}

export interface AdminServiceListQuery extends AdminServiceFilters {
  page: number;
}

export async function listAdminServices(
  query: AdminServiceListQuery,
  init: RequestInit = {},
): Promise<AdminApiResult<AdminServiceList>> {
  const result = await adminRequest<unknown>(
    withAdminQuery(ADMIN_API_PATHS.services, {
      filters: {
        active:
          query.status === "active"
            ? true
            : query.status === "inactive"
              ? false
              : undefined,
      },
      limit: ADMIN_LIST_PAGE_SIZE,
      page: query.page,
      search: query.query,
    }),
    init,
  );
  return mapAdminResult(result, mapServiceList);
}

export async function getAdminService(
  id: string,
  init: RequestInit = {},
): Promise<AdminApiResult<AdminService>> {
  const result = await adminRequest<unknown>(
    withAdminApiId(ADMIN_API_PATHS.service, id),
    init,
  );
  return mapAdminResult(result, (value) => {
    if (!isRecord(value)) {
      return null;
    }

    return mapService(value.service ?? value);
  });
}

function mapServiceList(value: unknown): AdminServiceList | null {
  if (!isRecord(value) || !Array.isArray(value.items)) {
    return null;
  }

  const pagination = mapAdminPagination(value.pagination, ADMIN_LIST_PAGE_SIZE);

  if (pagination === null) {
    return null;
  }

  const services: AdminService[] = [];

  for (const item of value.items) {
    const service = mapService(item);

    if (service === null) {
      return null;
    }

    services.push(service);
  }

  return { pagination, services };
}

function mapService(value: unknown): AdminService | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = readString(value.id);

  if (id === null) {
    return null;
  }

  return {
    coverImageUrl: readNullableString(value.coverImageUrl),
    id,
    isActive: readBoolean(value.isActive),
    name: readNullableString(value.name),
    shortDescription: readNullableString(value.shortDescription),
    slug: readNullableString(value.slug),
  };
}

export function shouldRenderServicePagination(
  pagination: AdminServicePagination | undefined,
  visibleCount: number,
): boolean {
  return (
    pagination !== undefined &&
    pagination.total > 0 &&
    pagination.totalPages > 1 &&
    visibleCount > 0
  );
}

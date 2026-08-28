import {
  adminServiceCopy,
  adminServiceStatusLabels,
} from "@/config/admin-services";
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

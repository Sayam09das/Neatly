import { describe, expect, it } from "vitest";
import {
  adminServiceCopy,
  defaultAdminServiceFilters,
} from "@/config/admin-services";
import {
  filterServices,
  getServiceDescriptionLabel,
  getServiceNameLabel,
  getServiceStatus,
  getServiceStatusLabel,
  hasActiveServiceFilters,
  shouldRenderServicePagination,
} from "@/lib/admin/services";
import type { AdminService } from "@/types/admin-service";

const SERVICE: AdminService = {
  coverImageUrl: null,
  id: "service_alpha",
  isActive: true,
  name: "Alpha package",
  shortDescription: "Configured scope for supplied records only.",
  slug: "alpha-package",
};

describe("filterServices", (): void => {
  it("filters supplied services only and never invents rows", (): void => {
    expect(filterServices([], defaultAdminServiceFilters)).toEqual([]);
    expect(
      filterServices([SERVICE], {
        ...defaultAdminServiceFilters,
        query: "missing",
      }),
    ).toEqual([]);
    expect(
      filterServices([SERVICE], {
        ...defaultAdminServiceFilters,
        query: "service_alpha",
      }),
    ).toEqual([SERVICE]);
    expect(
      filterServices([SERVICE], {
        ...defaultAdminServiceFilters,
        query: "configured scope",
      }),
    ).toEqual([SERVICE]);
    expect(
      filterServices([SERVICE], {
        ...defaultAdminServiceFilters,
        status: "active",
      }),
    ).toEqual([SERVICE]);
    expect(
      filterServices([SERVICE], {
        ...defaultAdminServiceFilters,
        status: "inactive",
      }),
    ).toEqual([]);
  });
});

describe("service presentation helpers", (): void => {
  it("maps isActive to domain status labels without inventing extras", (): void => {
    expect(getServiceStatus(null)).toBeNull();
    expect(getServiceStatus(true)).toBe("active");
    expect(getServiceStatus(false)).toBe("inactive");
    expect(getServiceStatusLabel(null)).toBe(adminServiceCopy.emptyValue);
    expect(getServiceStatusLabel(true)).toBe("Active");
    expect(getServiceStatusLabel(false)).toBe("Inactive");
  });

  it("keeps empty names and descriptions neutral", (): void => {
    expect(getServiceNameLabel(null)).toBe(adminServiceCopy.emptyValue);
    expect(getServiceNameLabel("   ")).toBe(adminServiceCopy.emptyValue);
    expect(getServiceNameLabel(SERVICE.name)).toBe("Alpha package");
    expect(getServiceDescriptionLabel(null)).toBe(adminServiceCopy.emptyValue);
    expect(getServiceDescriptionLabel(SERVICE.shortDescription)).toBe(
      "Configured scope for supplied records only.",
    );
  });

  it("detects active filters and hides pagination without data", (): void => {
    expect(hasActiveServiceFilters(defaultAdminServiceFilters)).toBe(false);
    expect(
      hasActiveServiceFilters({
        ...defaultAdminServiceFilters,
        query: "service_alpha",
      }),
    ).toBe(true);
    expect(shouldRenderServicePagination(undefined, 0)).toBe(false);
    expect(
      shouldRenderServicePagination(
        {
          page: 1,
          pageSize: 10,
          total: 0,
          totalPages: 0,
        },
        0,
      ),
    ).toBe(false);
    expect(
      shouldRenderServicePagination(
        {
          page: 1,
          pageSize: 10,
          total: 24,
          totalPages: 3,
        },
        10,
      ),
    ).toBe(true);
  });
});

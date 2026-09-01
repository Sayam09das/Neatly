"use client";

import { type ReactElement, useState } from "react";
import {
  AdminDashboardBlock,
  AdminDashboardMotion,
} from "@/components/admin/admin-dashboard-motion";
import { PortfolioMetrics } from "@/components/admin/portfolio/portfolio-metrics";
import { PortfolioTable } from "@/components/admin/portfolio/portfolio-table";
import { PortfolioToolbar } from "@/components/admin/portfolio/portfolio-toolbar";
import { ADMIN_SEARCH_DEBOUNCE_MS } from "@/config/admin-api";
import {
  adminPortfolioCopy,
  defaultAdminPortfolioFilters,
} from "@/config/admin-portfolio";
import {
  type AdminPortfolioList,
  filterPortfolioProjects,
  hasActivePortfolioFilters,
  listAdminPortfolioProjects,
  paginatePortfolioProjects,
} from "@/lib/admin/portfolio";
import { useAdminListState } from "@/lib/admin/use-admin-list-state";
import {
  type AdminQueryState,
  useAdminQuery,
} from "@/lib/admin/use-admin-query";
import { useAdminRefresh } from "@/lib/admin/use-admin-refresh";
import { useDebouncedValue } from "@/lib/admin/use-debounced-value";
import type {
  AdminPortfolioFilters,
  AdminPortfolioPagination,
  AdminPortfolioPresentation,
  AdminPortfolioProject,
} from "@/types/admin-portfolio";

interface AdminPortfolioProps {
  presentation?: AdminPortfolioPresentation;
}

export function AdminPortfolio({
  presentation,
}: AdminPortfolioProps): ReactElement {
  if (presentation === undefined) {
    return <AdminPortfolioLive />;
  }

  return <AdminPortfolioView presentation={presentation} />;
}

function AdminPortfolioLive(): ReactElement {
  const { filters, page, setFilters, setPage } = useAdminListState({
    defaults: defaultAdminPortfolioFilters,
  });
  const debouncedQuery = useDebouncedValue(
    filters.query,
    ADMIN_SEARCH_DEBOUNCE_MS,
  );
  const requestKey = JSON.stringify({
    category: filters.category,
    createdFrom: filters.createdFrom,
    createdTo: filters.createdTo,
    dateRange: filters.dateRange,
    page,
    query: debouncedQuery,
    visibility: filters.visibility,
  });
  const query = useAdminQuery({
    enabled: true,
    request: (signal) =>
      listAdminPortfolioProjects(
        {
          ...filters,
          page,
          query: debouncedQuery,
        },
        { signal },
      ),
    requestKey,
  });
  useAdminRefresh("portfolio", query.retry);

  return (
    <AdminPortfolioView
      filters={filters}
      onFiltersChange={setFilters}
      onPageChange={setPage}
      page={page}
      presentation={toLivePortfolioPresentation(
        query,
        hasActivePortfolioFilters(filters),
      )}
    />
  );
}

interface AdminPortfolioViewProps {
  filters?: AdminPortfolioFilters;
  onFiltersChange?: (filters: AdminPortfolioFilters) => void;
  onPageChange?: (page: number) => void;
  page?: number;
  presentation: AdminPortfolioPresentation;
}

function AdminPortfolioView({
  filters: filtersProp,
  onFiltersChange,
  onPageChange,
  page: pageProp,
  presentation,
}: AdminPortfolioViewProps): ReactElement {
  const [localFilters, setLocalFilters] = useState<AdminPortfolioFilters>(
    defaultAdminPortfolioFilters,
  );
  const [localPage, setLocalPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filters = filtersProp ?? localFilters;
  const setFilters = (next: AdminPortfolioFilters): void => {
    if (onFiltersChange === undefined) {
      setLocalFilters(next);
      setLocalPage(1);
      return;
    }

    onFiltersChange(next);
  };
  const page = pageProp ?? localPage;
  const setPage = onPageChange ?? setLocalPage;
  const sourceProjects = getSourceProjects(presentation);
  const filteredProjects =
    onFiltersChange === undefined
      ? filterPortfolioProjects(sourceProjects, filters)
      : sourceProjects;
  const paged = resolveVisibleProjects(
    filteredProjects,
    page,
    presentation,
    onFiltersChange,
  );
  const hasActiveFilters = hasActivePortfolioFilters(filters);

  return (
    <div
      className="mx-auto w-full min-w-0 max-w-page"
      data-slot="admin-portfolio"
    >
      <AdminDashboardMotion>
        <AdminDashboardBlock>
          <header className="max-w-prose">
            <h1 className="text-h1 text-foreground tracking-tight">
              {adminPortfolioCopy.heading}
            </h1>
            <p className="mt-3 text-body text-muted-foreground">
              {adminPortfolioCopy.description}
            </p>
          </header>
        </AdminDashboardBlock>
        <AdminDashboardBlock>
          <PortfolioMetrics
            presentation={presentation}
            projects={sourceProjects}
          />
        </AdminDashboardBlock>
        <AdminDashboardBlock>
          <PortfolioToolbar
            filters={filters}
            filtersOpen={filtersOpen}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={(): void => {
              setFilters(defaultAdminPortfolioFilters);
            }}
            onFiltersChange={setFilters}
            onFiltersOpenChange={setFiltersOpen}
          />
        </AdminDashboardBlock>
        <AdminDashboardBlock>
          <PortfolioTable
            hasActiveFilters={hasActiveFilters}
            onClearFilters={(): void => {
              setFilters(defaultAdminPortfolioFilters);
            }}
            onPageChange={setPage}
            pagination={paged.pagination}
            presentation={presentation}
            projects={paged.projects}
          />
        </AdminDashboardBlock>
      </AdminDashboardMotion>
    </div>
  );
}

function getSourceProjects(
  presentation: AdminPortfolioPresentation,
): readonly AdminPortfolioProject[] {
  return presentation.status === "ready" ? presentation.projects : [];
}

function resolveVisibleProjects(
  projects: readonly AdminPortfolioProject[],
  page: number,
  presentation: AdminPortfolioPresentation,
  onFiltersChange: ((filters: AdminPortfolioFilters) => void) | undefined,
): {
  pagination: AdminPortfolioPagination | undefined;
  projects: readonly AdminPortfolioProject[];
} {
  if (
    onFiltersChange !== undefined &&
    presentation.status === "ready" &&
    presentation.pagination !== undefined
  ) {
    return {
      pagination: presentation.pagination,
      projects,
    };
  }

  const paged = paginatePortfolioProjects(projects, page);

  return {
    pagination: paged.pagination,
    projects: paged.projects,
  };
}

function toLivePortfolioPresentation(
  query: AdminQueryState<AdminPortfolioList>,
  hasActiveFilters: boolean,
): AdminPortfolioPresentation {
  if (query.status === "loading") {
    return { status: "loading" };
  }

  if (query.status === "error") {
    return { onRetry: query.retry, status: "error" };
  }

  if (query.data === null || query.data.projects.length === 0) {
    return hasActiveFilters
      ? {
          pagination: query.data?.pagination,
          projects: [],
          status: "ready",
        }
      : { status: "empty" };
  }

  return {
    pagination: query.data.pagination,
    projects: query.data.projects,
    status: "ready",
  };
}

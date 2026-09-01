"use client";

import { type ReactElement, useState } from "react";
import {
  AdminDashboardBlock,
  AdminDashboardMotion,
} from "@/components/admin/admin-dashboard-motion";
import { BlogMetrics } from "@/components/admin/blog/blog-metrics";
import { BlogTable } from "@/components/admin/blog/blog-table";
import { BlogToolbar } from "@/components/admin/blog/blog-toolbar";
import { ADMIN_SEARCH_DEBOUNCE_MS } from "@/config/admin-api";
import { adminBlogCopy, defaultAdminBlogFilters } from "@/config/admin-blog";
import {
  type AdminBlogList,
  filterBlogPosts,
  hasActiveBlogFilters,
  listAdminBlogPosts,
  paginateBlogPosts,
} from "@/lib/admin/blog";
import { useAdminListState } from "@/lib/admin/use-admin-list-state";
import {
  type AdminQueryState,
  useAdminQuery,
} from "@/lib/admin/use-admin-query";
import { useAdminRefresh } from "@/lib/admin/use-admin-refresh";
import { useDebouncedValue } from "@/lib/admin/use-debounced-value";
import type {
  AdminBlogFilters,
  AdminBlogPagination,
  AdminBlogPost,
  AdminBlogPresentation,
} from "@/types/admin-blog";

interface AdminBlogProps {
  presentation?: AdminBlogPresentation;
}

export function AdminBlog({ presentation }: AdminBlogProps): ReactElement {
  if (presentation === undefined) {
    return <AdminBlogLive />;
  }

  return <AdminBlogView presentation={presentation} />;
}

function AdminBlogLive(): ReactElement {
  const { filters, page, setFilters, setPage } = useAdminListState({
    defaults: defaultAdminBlogFilters,
  });
  const debouncedQuery = useDebouncedValue(
    filters.query,
    ADMIN_SEARCH_DEBOUNCE_MS,
  );
  const requestKey = JSON.stringify({
    createdFrom: filters.createdFrom,
    createdTo: filters.createdTo,
    dateRange: filters.dateRange,
    page,
    query: debouncedQuery,
    status: filters.status,
  });
  const query = useAdminQuery({
    enabled: true,
    request: (signal) =>
      listAdminBlogPosts(
        {
          ...filters,
          page,
          query: debouncedQuery,
        },
        { signal },
      ),
    requestKey,
  });
  useAdminRefresh("blog", query.retry);

  return (
    <AdminBlogView
      filters={filters}
      onFiltersChange={setFilters}
      onPageChange={setPage}
      page={page}
      presentation={toLiveBlogPresentation(
        query,
        hasActiveBlogFilters(filters),
      )}
    />
  );
}

interface AdminBlogViewProps {
  filters?: AdminBlogFilters;
  onFiltersChange?: (filters: AdminBlogFilters) => void;
  onPageChange?: (page: number) => void;
  page?: number;
  presentation: AdminBlogPresentation;
}

function AdminBlogView({
  filters: filtersProp,
  onFiltersChange,
  onPageChange,
  page: pageProp,
  presentation,
}: AdminBlogViewProps): ReactElement {
  const [localFilters, setLocalFilters] = useState<AdminBlogFilters>(
    defaultAdminBlogFilters,
  );
  const [localPage, setLocalPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filters = filtersProp ?? localFilters;
  const setFilters = (next: AdminBlogFilters): void => {
    if (onFiltersChange === undefined) {
      setLocalFilters(next);
      setLocalPage(1);
      return;
    }

    onFiltersChange(next);
  };
  const page = pageProp ?? localPage;
  const setPage = onPageChange ?? setLocalPage;
  const sourcePosts = getSourcePosts(presentation);
  const filteredPosts =
    onFiltersChange === undefined
      ? filterBlogPosts(sourcePosts, filters)
      : sourcePosts;
  const paged = resolveVisiblePosts(
    filteredPosts,
    page,
    presentation,
    onFiltersChange,
  );
  const hasActiveFilters = hasActiveBlogFilters(filters);

  return (
    <div className="mx-auto w-full min-w-0 max-w-page" data-slot="admin-blog">
      <AdminDashboardMotion>
        <AdminDashboardBlock>
          <header className="max-w-prose">
            <h1 className="text-h1 text-foreground tracking-tight">
              {adminBlogCopy.heading}
            </h1>
            <p className="mt-3 text-body text-muted-foreground">
              {adminBlogCopy.description}
            </p>
          </header>
        </AdminDashboardBlock>
        <AdminDashboardBlock>
          <BlogMetrics posts={sourcePosts} presentation={presentation} />
        </AdminDashboardBlock>
        <AdminDashboardBlock>
          <BlogToolbar
            filters={filters}
            filtersOpen={filtersOpen}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={(): void => {
              setFilters(defaultAdminBlogFilters);
            }}
            onFiltersChange={setFilters}
            onFiltersOpenChange={setFiltersOpen}
          />
        </AdminDashboardBlock>
        <AdminDashboardBlock>
          <BlogTable
            hasActiveFilters={hasActiveFilters}
            onClearFilters={(): void => {
              setFilters(defaultAdminBlogFilters);
            }}
            onPageChange={setPage}
            pagination={paged.pagination}
            posts={paged.posts}
            presentation={presentation}
          />
        </AdminDashboardBlock>
      </AdminDashboardMotion>
    </div>
  );
}

function getSourcePosts(
  presentation: AdminBlogPresentation,
): readonly AdminBlogPost[] {
  return presentation.status === "ready" ? presentation.posts : [];
}

function resolveVisiblePosts(
  posts: readonly AdminBlogPost[],
  page: number,
  presentation: AdminBlogPresentation,
  onFiltersChange: ((filters: AdminBlogFilters) => void) | undefined,
): {
  pagination: AdminBlogPagination | undefined;
  posts: readonly AdminBlogPost[];
} {
  if (
    onFiltersChange !== undefined &&
    presentation.status === "ready" &&
    presentation.pagination !== undefined
  ) {
    return {
      pagination: presentation.pagination,
      posts,
    };
  }

  const paged = paginateBlogPosts(posts, page);

  return {
    pagination: paged.pagination,
    posts: paged.posts,
  };
}

function toLiveBlogPresentation(
  query: AdminQueryState<AdminBlogList>,
  hasActiveFilters: boolean,
): AdminBlogPresentation {
  if (query.status === "loading") {
    return { status: "loading" };
  }

  if (query.status === "error") {
    return { onRetry: query.retry, status: "error" };
  }

  if (query.data === null || query.data.posts.length === 0) {
    return hasActiveFilters
      ? {
          pagination: query.data?.pagination,
          posts: [],
          status: "ready",
        }
      : { status: "empty" };
  }

  return {
    pagination: query.data.pagination,
    posts: query.data.posts,
    status: "ready",
  };
}

/** @vitest-environment jsdom */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import AdminBlogPage from "@/app/admin/(app)/blog/page";
import { AdminBlog } from "@/components/admin/blog/admin-blog";
import { BlogCard } from "@/components/admin/blog/blog-card";
import { BlogDetails } from "@/components/admin/blog/blog-details";
import { BlogPagination } from "@/components/admin/blog/blog-pagination";
import { BlogStatusBadge } from "@/components/admin/blog/blog-status-badge";
import {
  ADMIN_BLOG_DETAILS_PATH,
  adminBlogCopy,
  adminBlogStatusLabels,
  getAdminBlogDetailsPath,
} from "@/config/admin-blog";
import { ADMIN_PATHS } from "@/config/admin-nav";
import type { AdminBlogPost } from "@/types/admin-blog";
import { adminBlogStatuses } from "@/types/admin-blog";

vi.mock("next/navigation", () => ({
  usePathname: (): string => "/admin/blog",
  useRouter: (): { replace: () => void } => ({
    replace: (): void => undefined,
  }),
  useSearchParams: (): URLSearchParams => new URLSearchParams(),
}));

vi.mock("@/lib/admin/use-admin-list-state", () => ({
  useAdminListState: <T,>({
    defaults,
  }: {
    defaults: T;
  }): {
    filters: T;
    page: number;
    setFilters: (filters: T) => void;
    setPage: (page: number) => void;
  } => ({
    filters: defaults,
    page: 1,
    setFilters: (): void => undefined,
    setPage: (): void => undefined,
  }),
}));

const TEST_POST: AdminBlogPost = {
  authorId: "admin_test",
  categoryId: null,
  categoryName: null,
  content: "Keep high-traffic rooms on a weekly cadence.",
  createdAt: "2026-08-30T09:00:00.000Z",
  excerpt: "Cleaning tips for busy weeks.",
  id: "post_test",
  publishedAt: null,
  seoDescription: null,
  seoTitle: null,
  slug: "cleaning-tips",
  status: "DRAFT",
  tags: ["tips"],
  title: "Cleaning tips",
  updatedAt: "2026-08-30T09:00:00.000Z",
};

const FORBIDDEN_FAKE_BLOG_COPY = ["John Smith", "Jane Doe"];

describe("Admin blog page", (): void => {
  it("renders the title, search, filters, metrics, and empty state without fake posts", async (): Promise<void> => {
    render(<AdminBlogPage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: adminBlogCopy.heading,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(adminBlogCopy.description)).toBeInTheDocument();
    expect(
      screen.getByRole("searchbox", { name: adminBlogCopy.searchLabel }),
    ).toHaveAttribute("placeholder", adminBlogCopy.searchPlaceholder);
    expect(
      screen.getByRole("combobox", { name: adminBlogCopy.statusLabel }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: adminBlogCopy.dateRangeLabel }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: adminBlogCopy.filtersLabel }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: adminBlogCopy.createAction }),
    ).toBeDisabled();
    expect(screen.getByText(adminBlogCopy.metricTotal)).toBeInTheDocument();
    expect(
      screen.getAllByText(adminBlogCopy.metricDraft).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(adminBlogCopy.metricPublished).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(adminBlogCopy.metricArchived).length,
    ).toBeGreaterThan(0);
    await waitFor((): void => {
      expect(screen.getByText(adminBlogCopy.emptyTitle)).toBeInTheDocument();
    });
    expect(
      screen.getByText(adminBlogCopy.emptyDescription),
    ).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("navigation", {
        name: adminBlogCopy.paginationLabel,
      }),
    ).not.toBeInTheDocument();

    const markup = document.body.textContent ?? "";

    for (const phrase of FORBIDDEN_FAKE_BLOG_COPY) {
      expect(markup).not.toContain(phrase);
    }
  });

  it("renders loading, error, and retry-ready states", async (): Promise<void> => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    const { rerender } = render(
      <AdminBlog presentation={{ status: "loading" }} />,
    );

    expect(screen.getAllByRole("status").length).toBeGreaterThan(0);
    expect(screen.getByText(adminBlogCopy.loadingLabel)).toBeInTheDocument();
    expect(
      document.querySelectorAll('[data-slot="skeleton"]').length,
    ).toBeGreaterThan(0);

    rerender(
      <AdminBlog
        presentation={{
          onRetry,
          status: "error",
        }}
      />,
    );

    expect(screen.getByText(adminBlogCopy.errorTitle)).toBeInTheDocument();
    expect(
      screen.getByText(adminBlogCopy.errorDescription),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: adminBlogCopy.retryLabel }),
    );
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("renders table structure, mobile cards, and accessible actions for supplied rows", async (): Promise<void> => {
    const user = userEvent.setup();

    render(
      <AdminBlog
        presentation={{
          posts: [TEST_POST],
          status: "ready",
        }}
      />,
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", {
        name: adminBlogCopy.tableTitle,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(TEST_POST.title).length).toBeGreaterThan(0);
    expect(screen.getAllByText(TEST_POST.slug).length).toBeGreaterThan(0);
    expect(document.querySelector('[data-slot="blog-card"]')).toBeTruthy();
    expect(
      screen.getAllByRole("link", { name: adminBlogCopy.viewAction }).length,
    ).toBeGreaterThan(0);

    const actionButton = screen.getAllByRole("button", {
      name: adminBlogCopy.actionsLabel,
    })[0];

    if (actionButton === undefined) {
      throw new Error("Expected a blog actions trigger.");
    }

    await user.click(actionButton);

    expect(
      await screen.findByRole("menuitem", {
        name: adminBlogCopy.viewAction,
      }),
    ).toHaveAttribute("href", getAdminBlogDetailsPath(TEST_POST.id));
    expect(
      screen.getByRole("menuitem", {
        name: adminBlogCopy.editAction,
      }),
    ).toHaveAttribute("data-disabled");
  });

  it("opens the filter sheet without inventing blog records", async (): Promise<void> => {
    const user = userEvent.setup();

    render(<AdminBlog presentation={{ status: "empty" }} />);

    await user.click(
      screen.getByRole("button", { name: adminBlogCopy.filtersLabel }),
    );

    expect(
      await screen.findByRole("dialog", {
        name: adminBlogCopy.filterSheetTitle,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(adminBlogCopy.filterSheetDescription),
    ).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await waitFor((): void => {
      expect(
        screen.queryByRole("dialog", {
          name: adminBlogCopy.filterSheetTitle,
        }),
      ).not.toBeInTheDocument();
    });
    expect(screen.queryByText(TEST_POST.id)).not.toBeInTheDocument();
  });

  it("shows filter chips and clear filters only when filters are active", async (): Promise<void> => {
    const user = userEvent.setup();

    render(<AdminBlog presentation={{ status: "empty" }} />);

    expect(
      screen.queryByRole("button", { name: adminBlogCopy.clearFilters }),
    ).not.toBeInTheDocument();

    await user.selectOptions(
      screen.getByRole("combobox", { name: adminBlogCopy.statusLabel }),
      "DRAFT",
    );

    expect(
      screen.getByRole("button", {
        name: `Remove ${adminBlogCopy.statusLabel}: ${adminBlogStatusLabels.DRAFT}`,
      }),
    ).toBeInTheDocument();
    const clearChip = screen.getAllByRole("button", {
      name: adminBlogCopy.clearFilters,
    })[0];

    if (clearChip === undefined) {
      throw new Error("Expected a clear filters action.");
    }

    await user.click(clearChip);
    await waitFor((): void => {
      expect(
        screen.queryByRole("button", { name: adminBlogCopy.clearFilters }),
      ).not.toBeInTheDocument();
    });
  });

  it("shows the search-empty state when filters hide supplied posts", async (): Promise<void> => {
    const user = userEvent.setup();

    render(
      <AdminBlog
        presentation={{
          posts: [TEST_POST],
          status: "ready",
        }}
      />,
    );

    await user.selectOptions(
      screen.getByRole("combobox", { name: adminBlogCopy.statusLabel }),
      "ARCHIVED",
    );

    expect(screen.getByText(adminBlogCopy.noMatchesTitle)).toBeInTheDocument();
    expect(
      screen.getByText(adminBlogCopy.noMatchesDescription),
    ).toBeInTheDocument();
    const clearMatches = screen.getAllByRole("button", {
      name: adminBlogCopy.clearFilters,
    })[0];

    if (clearMatches === undefined) {
      throw new Error("Expected a clear filters action.");
    }

    await user.click(clearMatches);
    expect(screen.getByRole("table")).toBeInTheDocument();
  });
});

describe("Blog presentation components", (): void => {
  it("renders every blog status as text", (): void => {
    const firstStatus = adminBlogStatuses[0];

    if (firstStatus === undefined) {
      throw new Error("Expected blog statuses.");
    }

    const { rerender } = render(<BlogStatusBadge status={firstStatus} />);

    for (const status of adminBlogStatuses) {
      rerender(<BlogStatusBadge status={status} />);
      expect(
        screen.getByText(adminBlogStatusLabels[status]),
      ).toBeInTheDocument();
    }
  });

  it("renders a compact post card for supplied data", (): void => {
    render(<BlogCard post={TEST_POST} />);

    expect(screen.getByText(TEST_POST.title)).toBeInTheDocument();
    expect(screen.getByText(TEST_POST.slug)).toBeInTheDocument();
    expect(screen.getByText(adminBlogStatusLabels.DRAFT)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: adminBlogCopy.viewAction }),
    ).toHaveAttribute("href", getAdminBlogDetailsPath(TEST_POST.id));
  });

  it("renders pagination architecture without inventing pages on empty data", (): void => {
    render(
      <BlogPagination
        pagination={{
          page: 1,
          pageSize: 10,
          total: 24,
          totalPages: 3,
        }}
      />,
    );

    expect(
      screen.getByRole("navigation", {
        name: adminBlogCopy.paginationLabel,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: adminBlogCopy.paginationPrevious,
      }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", {
        name: `${adminBlogCopy.paginationPageLabel} 2`,
      }),
    ).toBeInTheDocument();
  });

  it("keeps the details path wired for post review", (): void => {
    expect(ADMIN_PATHS.blog).toBe("/admin/blog");
    expect(ADMIN_BLOG_DETAILS_PATH).toBe("/admin/blog/[id]");
    expect(getAdminBlogDetailsPath("post_test")).toBe("/admin/blog/post_test");
  });
});

describe("Blog details", (): void => {
  it("renders supplied post details without inventing an author name", (): void => {
    render(
      <BlogDetails
        postId={TEST_POST.id}
        presentation={{ post: TEST_POST, status: "ready" }}
      />,
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: adminBlogCopy.detailsHeading,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(TEST_POST.title).length).toBeGreaterThan(0);
    expect(screen.getByText(TEST_POST.content)).toBeInTheDocument();
    expect(screen.getByText(TEST_POST.excerpt)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: adminBlogCopy.editAction }),
    ).toBeDisabled();
    expect(screen.getByText(adminBlogCopy.timelineCreated)).toBeInTheDocument();
    expect(
      screen.queryByText(adminBlogCopy.timelineUpdated),
    ).not.toBeInTheDocument();
    expect(document.body.textContent ?? "").not.toContain("John Smith");
  });

  it("renders the not-found state when a post is unavailable", (): void => {
    render(<BlogDetails postId="missing" presentation={{ status: "empty" }} />);

    expect(
      screen.getByText(adminBlogCopy.detailsNotFoundTitle),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: adminBlogCopy.backToBlog }),
    ).toHaveAttribute("href", ADMIN_PATHS.blog);
  });
});

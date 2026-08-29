/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CleanerJobs } from "@/components/cleaner/jobs/cleaner-jobs";
import {
  CLEANER_PATHS,
  cleanerJobPath,
  cleanerJobsCopy,
  cleanerSurfaceCopy,
} from "@/config/cleaner";
import type { CleanerJobList } from "@/types/cleaner";

const query = {
  page: 1,
  q: "",
  status: "" as const,
  window: "" as const,
};

const list: CleanerJobList = {
  items: [
    {
      actions: { canComplete: false, canStart: true },
      customerName: "Ada",
      id: "booking_own_1",
      scheduledAt: "2026-09-04T10:00:00.000Z",
      service: { id: "service_1", name: "Home Refresh" },
      serviceAddress: "12 Harbour Street",
      status: "ASSIGNED",
      updatedAt: "2026-08-30T09:00:00.000Z",
    },
  ],
  pagination: {
    page: 1,
    pageSize: 20,
    total: 1,
    totalPages: 1,
  },
};

describe("CleanerJobs", (): void => {
  it("renders assigned jobs and details links from real data", (): void => {
    render(<CleanerJobs list={list} query={query} />);

    expect(
      screen.getByRole("heading", { name: cleanerSurfaceCopy.jobs.heading }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Home Refresh").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Ada").length).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("link", { name: cleanerJobsCopy.viewJob })[0],
    ).toHaveAttribute("href", cleanerJobPath("booking_own_1"));
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    expect(screen.queryByText("Accept Job")).not.toBeInTheDocument();
  });

  it("shows distinct empty and filtered-empty states", (): void => {
    const { rerender } = render(
      <CleanerJobs
        list={{
          items: [],
          pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0 },
        }}
        query={query}
      />,
    );

    expect(screen.getByText(cleanerJobsCopy.emptyTitle)).toBeInTheDocument();
    expect(
      screen.queryByText(cleanerJobsCopy.filteredEmptyTitle),
    ).not.toBeInTheDocument();

    rerender(
      <CleanerJobs
        list={{
          items: [],
          pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0 },
        }}
        query={{ ...query, status: "COMPLETED" }}
      />,
    );

    expect(
      screen.getByText(cleanerJobsCopy.filteredEmptyTitle),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: cleanerJobsCopy.clearFilters }),
    ).toHaveAttribute("href", CLEANER_PATHS.jobs);
  });
});

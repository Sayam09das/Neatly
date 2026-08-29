/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CleanerDashboardOverview } from "@/components/cleaner/dashboard/cleaner-dashboard-overview";
import {
  CLEANER_PATHS,
  cleanerDashboardCopy,
  cleanerJobPath,
} from "@/config/cleaner";
import { formatCleanerDateHeading } from "@/lib/cleaner/schedule";
import type { CleanerOverview } from "@/types/cleaner";

const identity = {
  email: "mia@neatly.example",
  name: "Mia Cleaner",
};

const nextJob = {
  actions: { canComplete: false, canStart: true },
  customerName: "Ada",
  id: "booking_own_1",
  scheduledAt: "2026-09-04T10:00:00.000Z",
  service: { id: "service_1", name: "Home Refresh" },
  serviceAddress: "12 Harbour Street",
  status: "ASSIGNED" as const,
  updatedAt: "2026-08-30T09:00:00.000Z",
};

describe("CleanerDashboardOverview", (): void => {
  it("greets the authenticated cleaner and shows empty job states", (): void => {
    const overview: CleanerOverview = {
      nextJob: null,
      summary: {
        assignedToday: 0,
        completedToday: 0,
        inProgress: 0,
        upcoming: 0,
      },
      todayJobs: [],
    };

    render(
      <CleanerDashboardOverview
        identity={identity}
        now={new Date("2026-08-31T08:00:00.000Z")}
        overview={overview}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Good morning, Mia" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        formatCleanerDateHeading(new Date("2026-08-31T08:00:00.000Z")),
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(cleanerDashboardCopy.assignedToday),
    ).toBeInTheDocument();
    expect(screen.getAllByText("0").length).toBeGreaterThan(0);
    expect(
      screen.getByText(cleanerDashboardCopy.nextJobEmptyTitle),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", {
        name: cleanerDashboardCopy.nextJobEmptyAction,
      })[0],
    ).toHaveAttribute("href", CLEANER_PATHS.jobs);
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    expect(screen.queryByText(/\$4,250/)).not.toBeInTheDocument();
  });

  it("renders the next assigned job from backend data", (): void => {
    const overview: CleanerOverview = {
      nextJob,
      summary: {
        assignedToday: 1,
        completedToday: 0,
        inProgress: 0,
        upcoming: 1,
      },
      todayJobs: [nextJob],
    };

    render(
      <CleanerDashboardOverview
        identity={identity}
        now={new Date("2026-08-31T18:00:00.000Z")}
        overview={overview}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Good evening, Mia" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Home Refresh").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Ada").length).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("link", { name: cleanerDashboardCopy.viewJob })[0],
    ).toHaveAttribute("href", cleanerJobPath(nextJob.id));
    expect(screen.queryByText("Accept Job")).not.toBeInTheDocument();
    expect(screen.queryByText("Start Job")).not.toBeInTheDocument();
  });
});

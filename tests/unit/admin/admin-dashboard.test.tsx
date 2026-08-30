/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AdminActivityList } from "@/components/admin/admin-activity-list";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import {
  adminDashboardCopy,
  adminDashboardMetrics,
  adminDashboardQuickActions,
} from "@/config/admin-dashboard";
import { ADMIN_PATHS } from "@/config/admin-nav";

const FORBIDDEN_DASHBOARD_COPY = ["revenue", "₹", "+24%", "-12%", "96%"];

describe("AdminDashboard", (): void => {
  it("renders the overview heading, empty metrics, and PRD quick actions", (): void => {
    render(<AdminDashboard />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: adminDashboardCopy.heading,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(adminDashboardCopy.description),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: adminDashboardCopy.metricsHeading,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: adminDashboardCopy.operationsHeading,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: adminDashboardCopy.activityHeading,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: adminDashboardCopy.quickActionsHeading,
      }),
    ).toBeInTheDocument();

    for (const metric of adminDashboardMetrics) {
      expect(screen.getByText(metric.label)).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: new RegExp(metric.label) }),
      ).toHaveAttribute("href", metric.href);
    }

    expect(screen.getAllByText(adminDashboardCopy.emptyValueLabel).length).toBe(
      adminDashboardMetrics.length,
    );
    expect(
      screen.getByText(adminDashboardCopy.activityEmptyTitle),
    ).toBeInTheDocument();
    expect(
      screen.getByText(adminDashboardCopy.operationsEmptyTitle),
    ).toBeInTheDocument();

    for (const action of adminDashboardQuickActions) {
      expect(
        screen.getByRole("link", {
          name: new RegExp(`${action.title}[\\s\\S]*${action.description}`),
        }),
      ).toHaveAttribute("href", action.href);
    }

    expect(screen.getByRole("link", { name: /Quotes/ })).toHaveAttribute(
      "href",
      ADMIN_PATHS.quotes,
    );

    const markup = document.body.textContent ?? "";

    for (const phrase of FORBIDDEN_DASHBOARD_COPY) {
      expect(markup.toLowerCase()).not.toContain(phrase.toLowerCase());
    }

    expect(markup).not.toMatch(/\$\d/);
    expect(markup).not.toMatch(/\d{2,}/);
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("uses a single-column default grid that expands at larger breakpoints", (): void => {
    render(<AdminDashboard />);

    const metricGrid = document.querySelector(
      '[data-slot="admin-metrics-grid"]',
    );

    expect(metricGrid).toBeInstanceOf(HTMLElement);
    expect(metricGrid?.className).toContain("grid-cols-1");
    expect(metricGrid?.className).toContain("md:grid-cols-2");
    expect(metricGrid?.className).toContain("xl:grid-cols-4");
  });
});

describe("AdminActivityList", (): void => {
  it("renders the empty activity state", (): void => {
    render(<AdminActivityList presentation={{ status: "empty" }} />);

    expect(
      screen.getByText(adminDashboardCopy.activityEmptyTitle),
    ).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("renders a loading activity skeleton", (): void => {
    render(<AdminActivityList presentation={{ status: "loading" }} />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(
      document.querySelectorAll('[data-slot="skeleton"]').length,
    ).toBeGreaterThan(0);
  });

  it("renders ready activity items without invented records on the dashboard", (): void => {
    render(
      <AdminActivityList
        presentation={{
          items: [
            {
              description: "A quote was received.",
              id: "activity-test",
              title: "Quote received",
            },
          ],
          status: "ready",
        }}
      />,
    );

    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getByText("Quote received")).toBeInTheDocument();
  });
});

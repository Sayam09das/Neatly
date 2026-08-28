/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { QuotesIcon } from "@/components/admin/admin-icons";
import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { adminDashboardCopy } from "@/config/admin-dashboard";
import { ADMIN_PATHS } from "@/config/admin-nav";

const METRIC_LABEL = "New quote requests";

describe("AdminMetricCard", (): void => {
  it("renders the metric label", (): void => {
    render(
      <AdminMetricCard
        icon={QuotesIcon}
        label={METRIC_LABEL}
        presentation={{ status: "idle" }}
      />,
    );

    expect(screen.getByText(METRIC_LABEL)).toBeInTheDocument();
  });

  it("renders an idle placeholder without claiming zero", (): void => {
    render(
      <AdminMetricCard
        icon={QuotesIcon}
        label={METRIC_LABEL}
        presentation={{ status: "idle" }}
      />,
    );

    expect(
      screen.queryByText(adminDashboardCopy.emptyValueLabel),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("0")).not.toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("renders a loading skeleton without a numeric value", (): void => {
    render(
      <AdminMetricCard
        icon={QuotesIcon}
        label={METRIC_LABEL}
        presentation={{ status: "loading" }}
      />,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(
      document.querySelectorAll('[data-slot="skeleton"]').length,
    ).toBeGreaterThan(0);
    expect(screen.queryByText(/\d/)).not.toBeInTheDocument();
  });

  it("renders the empty state as no data rather than zero", (): void => {
    render(
      <AdminMetricCard
        icon={QuotesIcon}
        label={METRIC_LABEL}
        presentation={{ status: "empty" }}
      />,
    );

    expect(
      screen.getByText(adminDashboardCopy.emptyValueLabel),
    ).toBeInTheDocument();
    expect(screen.queryByText("0")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("status", {
        name: adminDashboardCopy.metricErrorLabel,
      }),
    ).not.toBeInTheDocument();
  });

  it("renders a success value supplied by the caller", (): void => {
    render(
      <AdminMetricCard
        icon={QuotesIcon}
        label={METRIC_LABEL}
        presentation={{
          status: "success",
          supportingText: "Awaiting review",
          value: "0",
        }}
      />,
    );

    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("Awaiting review")).toBeInTheDocument();
    expect(
      screen.queryByText(adminDashboardCopy.emptyValueLabel),
    ).not.toBeInTheDocument();
  });

  it("hides the trend slot when no trend is supplied", (): void => {
    render(
      <AdminMetricCard
        icon={QuotesIcon}
        label={METRIC_LABEL}
        presentation={{ status: "success", value: "0" }}
      />,
    );

    expect(
      document.querySelector('[data-slot="admin-metric-trend"]'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(adminDashboardCopy.trendIncreaseLabel),
    ).not.toBeInTheDocument();
  });

  it("renders a positive trend with accessible text and no color-only meaning", (): void => {
    render(
      <AdminMetricCard
        icon={QuotesIcon}
        label={METRIC_LABEL}
        presentation={{
          status: "success",
          trend: {
            direction: "positive",
            label: "Higher than last period",
          },
          value: "0",
        }}
      />,
    );

    expect(
      screen.getByText(adminDashboardCopy.trendIncreaseLabel),
    ).toBeInTheDocument();
    expect(screen.getByText("Higher than last period")).toBeInTheDocument();
  });

  it("renders a negative trend with accessible text", (): void => {
    render(
      <AdminMetricCard
        icon={QuotesIcon}
        label={METRIC_LABEL}
        presentation={{
          status: "success",
          trend: {
            direction: "negative",
            label: "Lower than last period",
          },
          value: "0",
        }}
      />,
    );

    expect(
      screen.getByText(adminDashboardCopy.trendDecreaseLabel),
    ).toBeInTheDocument();
    expect(screen.getByText("Lower than last period")).toBeInTheDocument();
  });

  it("exposes an error retry action without fetching", async (): Promise<void> => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(
      <AdminMetricCard
        icon={QuotesIcon}
        label={METRIC_LABEL}
        presentation={{ onRetry, status: "error" }}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      adminDashboardCopy.metricErrorLabel,
    );
    await user.click(
      screen.getByRole("button", { name: adminDashboardCopy.retryLabel }),
    );
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("uses a link only when a destination is provided", (): void => {
    const { rerender } = render(
      <AdminMetricCard
        icon={QuotesIcon}
        label={METRIC_LABEL}
        presentation={{ status: "empty" }}
      />,
    );

    expect(screen.queryByRole("link")).not.toBeInTheDocument();

    rerender(
      <AdminMetricCard
        href={ADMIN_PATHS.quotes}
        icon={QuotesIcon}
        label={METRIC_LABEL}
        presentation={{ status: "empty" }}
      />,
    );

    expect(
      screen.getByRole("link", { name: new RegExp(METRIC_LABEL) }),
    ).toHaveAttribute("href", ADMIN_PATHS.quotes);
  });
});

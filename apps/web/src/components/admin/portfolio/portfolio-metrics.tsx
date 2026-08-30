"use client";

import type { ReactElement } from "react";
import { PortfolioIcon } from "@/components/admin/admin-icons";
import {
  AdminMetricCard,
  type AdminMetricPresentation,
} from "@/components/admin/admin-metric-card";
import { AdminMetricsGrid } from "@/components/admin/admin-metrics-grid";
import { ADMIN_PATHS } from "@/config/admin-nav";
import { adminPortfolioCopy } from "@/config/admin-portfolio";
import { countPortfolioMetrics } from "@/lib/admin/portfolio";
import type {
  AdminPortfolioPresentation,
  AdminPortfolioProject,
} from "@/types/admin-portfolio";

interface PortfolioMetricsProps {
  presentation: AdminPortfolioPresentation;
  projects: readonly AdminPortfolioProject[];
}

export function PortfolioMetrics({
  presentation,
  projects,
}: PortfolioMetricsProps): ReactElement {
  const counts = countPortfolioMetrics(projects);
  const cards: readonly {
    href: string;
    id: string;
    label: string;
    value: number;
  }[] = [
    {
      href: ADMIN_PATHS.portfolio,
      id: "total",
      label: adminPortfolioCopy.metricTotal,
      value: counts.total,
    },
    {
      href: `${ADMIN_PATHS.portfolio}?visibility=published`,
      id: "published",
      label: adminPortfolioCopy.metricPublished,
      value: counts.published,
    },
    {
      href: `${ADMIN_PATHS.portfolio}?visibility=unpublished`,
      id: "unpublished",
      label: adminPortfolioCopy.metricUnpublished,
      value: counts.unpublished,
    },
    {
      href: ADMIN_PATHS.portfolio,
      id: "featured",
      label: adminPortfolioCopy.metricFeatured,
      value: counts.featured,
    },
  ];

  return (
    <AdminMetricsGrid>
      {cards.map((card) => (
        <AdminMetricCard
          href={card.href}
          icon={PortfolioIcon}
          key={card.id}
          label={card.label}
          presentation={toMetricPresentation(
            presentation,
            card.value,
            projects.length,
          )}
        />
      ))}
    </AdminMetricsGrid>
  );
}

function toMetricPresentation(
  presentation: AdminPortfolioPresentation,
  value: number,
  projectCount: number,
): AdminMetricPresentation {
  if (presentation.status === "loading") {
    return { status: "loading" };
  }

  if (presentation.status === "error") {
    return { onRetry: presentation.onRetry, status: "error" };
  }

  if (presentation.status === "empty" || projectCount === 0) {
    return { status: "empty" };
  }

  return {
    status: "success",
    value: String(value),
  };
}

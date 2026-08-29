"use client";

import type { ReactElement } from "react";
import type { AdminActivityPresentation } from "@/components/admin/admin-activity-list";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import type { AdminMetricPresentation } from "@/components/admin/admin-metric-card";
import { adminDashboardMetrics } from "@/config/admin-dashboard";
import {
  getAdminDashboard,
  toAdminDashboardViewModel,
} from "@/lib/admin/dashboard";
import { useAdminQuery } from "@/lib/admin/use-admin-query";

export function AdminDashboardLive(): ReactElement {
  const query = useAdminQuery({
    enabled: true,
    request: (signal) => getAdminDashboard({ signal }),
    requestKey: "admin-dashboard",
  });

  if (query.status === "loading") {
    return (
      <AdminDashboard
        activity={{ status: "loading" }}
        metricPresentations={loadingMetrics()}
        operations={{ status: "loading" }}
      />
    );
  }

  if (query.status === "error" || query.data === null) {
    const errorPresentation: AdminMetricPresentation = {
      onRetry: query.retry,
      status: "error",
    };
    const activityError: AdminActivityPresentation = {
      onRetry: query.retry,
      status: "error",
    };

    return (
      <AdminDashboard
        activity={activityError}
        metricPresentations={{
          bookings: errorPresentation,
          customers: errorPresentation,
          reviews: errorPresentation,
          services: errorPresentation,
        }}
        operations={activityError}
      />
    );
  }

  const view = toAdminDashboardViewModel(query.data);

  return (
    <AdminDashboard
      activity={
        view.activityItems.length === 0
          ? { status: "empty" }
          : { items: view.activityItems, status: "ready" }
      }
      metricPresentations={view.metrics}
      operations={
        view.operationItems.length === 0
          ? { status: "empty" }
          : { items: view.operationItems, status: "ready" }
      }
    />
  );
}

function loadingMetrics(): Record<string, AdminMetricPresentation> {
  return Object.fromEntries(
    adminDashboardMetrics.map((metric) => [metric.id, { status: "loading" }]),
  );
}

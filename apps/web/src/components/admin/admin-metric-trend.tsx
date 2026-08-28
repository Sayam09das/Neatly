import { cn } from "@neatly/utils";
import type { ReactElement } from "react";
import { TrendDownIcon, TrendUpIcon } from "@/components/admin/admin-icons";
import { adminDashboardCopy } from "@/config/admin-dashboard";

export type AdminMetricTrendDirection = "positive" | "negative" | "neutral";

export interface AdminMetricTrendValue {
  direction: AdminMetricTrendDirection;
  label: string;
}

interface AdminMetricTrendProps {
  trend: AdminMetricTrendValue;
}

export function AdminMetricTrend({
  trend,
}: AdminMetricTrendProps): ReactElement {
  const accessibleLabel =
    trend.direction === "positive"
      ? adminDashboardCopy.trendIncreaseLabel
      : trend.direction === "negative"
        ? adminDashboardCopy.trendDecreaseLabel
        : adminDashboardCopy.trendNeutralLabel;

  return (
    <p
      className={cn(
        "mt-2 inline-flex items-center gap-1 text-caption",
        trend.direction === "positive" && "text-foreground",
        trend.direction === "negative" && "text-muted-foreground",
        trend.direction === "neutral" && "text-muted-foreground",
      )}
      data-slot="admin-metric-trend"
    >
      {trend.direction === "positive" ? (
        <TrendUpIcon />
      ) : trend.direction === "negative" ? (
        <TrendDownIcon />
      ) : null}
      <span className="sr-only">{accessibleLabel}</span>
      <span>{trend.label}</span>
    </p>
  );
}

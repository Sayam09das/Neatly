"use client";

import type { ReactElement } from "react";
import { QuotesIcon } from "@/components/admin/admin-icons";
import {
  AdminMetricCard,
  type AdminMetricPresentation,
} from "@/components/admin/admin-metric-card";
import { AdminMetricsGrid } from "@/components/admin/admin-metrics-grid";
import { ADMIN_PATHS } from "@/config/admin-nav";
import { adminQuoteCopy } from "@/config/admin-quotes";
import { countQuoteMetrics } from "@/lib/admin/quotes";
import type { AdminQuote, AdminQuotePresentation } from "@/types/admin-quote";

interface QuotesMetricsProps {
  presentation: AdminQuotePresentation;
  quotes: readonly AdminQuote[];
}

export function QuotesMetrics({
  presentation,
  quotes,
}: QuotesMetricsProps): ReactElement {
  const counts = countQuoteMetrics(quotes);
  const cards: readonly {
    href: string;
    id: string;
    label: string;
    value: number;
  }[] = [
    {
      href: ADMIN_PATHS.quotes,
      id: "total",
      label: adminQuoteCopy.metricTotal,
      value: counts.total,
    },
    {
      href: `${ADMIN_PATHS.quotes}?status=NEW`,
      id: "new",
      label: adminQuoteCopy.metricNew,
      value: counts.new,
    },
    {
      href: `${ADMIN_PATHS.quotes}?status=REVIEWING`,
      id: "reviewing",
      label: adminQuoteCopy.metricReviewing,
      value: counts.reviewing,
    },
    {
      href: `${ADMIN_PATHS.quotes}?status=QUOTED`,
      id: "quoted",
      label: adminQuoteCopy.metricQuoted,
      value: counts.quoted,
    },
    {
      href: `${ADMIN_PATHS.quotes}?status=CONVERTED`,
      id: "converted",
      label: adminQuoteCopy.metricConverted,
      value: counts.converted,
    },
  ];

  return (
    <AdminMetricsGrid>
      {cards.map((card) => (
        <AdminMetricCard
          href={card.href}
          icon={QuotesIcon}
          key={card.id}
          label={card.label}
          presentation={toMetricPresentation(
            presentation,
            card.value,
            quotes.length,
          )}
        />
      ))}
    </AdminMetricsGrid>
  );
}

function toMetricPresentation(
  presentation: AdminQuotePresentation,
  value: number,
  quoteCount: number,
): AdminMetricPresentation {
  if (presentation.status === "loading") {
    return { status: "loading" };
  }

  if (presentation.status === "error") {
    return { onRetry: presentation.onRetry, status: "error" };
  }

  if (presentation.status === "empty" || quoteCount === 0) {
    return { status: "empty" };
  }

  return {
    status: "success",
    value: String(value),
  };
}

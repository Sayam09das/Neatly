"use client";

import type { ReactElement } from "react";
import { NewsletterIcon } from "@/components/admin/admin-icons";
import {
  AdminMetricCard,
  type AdminMetricPresentation,
} from "@/components/admin/admin-metric-card";
import { AdminMetricsGrid } from "@/components/admin/admin-metrics-grid";
import { ADMIN_PATHS } from "@/config/admin-nav";
import { adminNewsletterCopy } from "@/config/admin-newsletter";
import { countNewsletterMetrics } from "@/lib/admin/newsletter";
import type {
  AdminNewsletterPresentation,
  AdminNewsletterSubscriber,
} from "@/types/admin-newsletter";

interface NewsletterMetricsProps {
  presentation: AdminNewsletterPresentation;
  subscribers: readonly AdminNewsletterSubscriber[];
}

export function NewsletterMetrics({
  presentation,
  subscribers,
}: NewsletterMetricsProps): ReactElement {
  const counts = countNewsletterMetrics(subscribers);
  const cards: readonly {
    href: string;
    id: string;
    label: string;
    value: number;
  }[] = [
    {
      href: ADMIN_PATHS.newsletter,
      id: "total",
      label: adminNewsletterCopy.metricTotal,
      value: counts.total,
    },
    {
      href: `${ADMIN_PATHS.newsletter}?status=SUBSCRIBED`,
      id: "subscribed",
      label: adminNewsletterCopy.metricSubscribed,
      value: counts.subscribed,
    },
    {
      href: `${ADMIN_PATHS.newsletter}?status=UNSUBSCRIBED`,
      id: "unsubscribed",
      label: adminNewsletterCopy.metricUnsubscribed,
      value: counts.unsubscribed,
    },
  ];

  return (
    <AdminMetricsGrid>
      {cards.map((card) => (
        <AdminMetricCard
          href={card.href}
          icon={NewsletterIcon}
          key={card.id}
          label={card.label}
          presentation={toMetricPresentation(
            presentation,
            card.value,
            subscribers.length,
          )}
        />
      ))}
    </AdminMetricsGrid>
  );
}

function toMetricPresentation(
  presentation: AdminNewsletterPresentation,
  value: number,
  subscriberCount: number,
): AdminMetricPresentation {
  if (presentation.status === "loading") {
    return { status: "loading" };
  }

  if (presentation.status === "error") {
    return { onRetry: presentation.onRetry, status: "error" };
  }

  if (presentation.status === "empty" || subscriberCount === 0) {
    return { status: "empty" };
  }

  return {
    status: "success",
    value: String(value),
  };
}

"use client";

import type { ReactElement } from "react";
import { BlogIcon } from "@/components/admin/admin-icons";
import {
  AdminMetricCard,
  type AdminMetricPresentation,
} from "@/components/admin/admin-metric-card";
import { AdminMetricsGrid } from "@/components/admin/admin-metrics-grid";
import { adminBlogCopy } from "@/config/admin-blog";
import { ADMIN_PATHS } from "@/config/admin-nav";
import { countBlogMetrics } from "@/lib/admin/blog";
import type { AdminBlogPost, AdminBlogPresentation } from "@/types/admin-blog";

interface BlogMetricsProps {
  posts: readonly AdminBlogPost[];
  presentation: AdminBlogPresentation;
}

export function BlogMetrics({
  posts,
  presentation,
}: BlogMetricsProps): ReactElement {
  const counts = countBlogMetrics(posts);
  const cards: readonly {
    href: string;
    id: string;
    label: string;
    value: number;
  }[] = [
    {
      href: ADMIN_PATHS.blog,
      id: "total",
      label: adminBlogCopy.metricTotal,
      value: counts.total,
    },
    {
      href: `${ADMIN_PATHS.blog}?status=DRAFT`,
      id: "draft",
      label: adminBlogCopy.metricDraft,
      value: counts.draft,
    },
    {
      href: `${ADMIN_PATHS.blog}?status=PUBLISHED`,
      id: "published",
      label: adminBlogCopy.metricPublished,
      value: counts.published,
    },
    {
      href: `${ADMIN_PATHS.blog}?status=ARCHIVED`,
      id: "archived",
      label: adminBlogCopy.metricArchived,
      value: counts.archived,
    },
  ];

  return (
    <AdminMetricsGrid>
      {cards.map((card) => (
        <AdminMetricCard
          href={card.href}
          icon={BlogIcon}
          key={card.id}
          label={card.label}
          presentation={toMetricPresentation(
            presentation,
            card.value,
            posts.length,
          )}
        />
      ))}
    </AdminMetricsGrid>
  );
}

function toMetricPresentation(
  presentation: AdminBlogPresentation,
  value: number,
  postCount: number,
): AdminMetricPresentation {
  if (presentation.status === "loading") {
    return { status: "loading" };
  }

  if (presentation.status === "error") {
    return { onRetry: presentation.onRetry, status: "error" };
  }

  if (presentation.status === "empty" || postCount === 0) {
    return { status: "empty" };
  }

  return {
    status: "success",
    value: String(value),
  };
}

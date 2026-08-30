"use client";

import type { ReactElement } from "react";
import { ContactsIcon } from "@/components/admin/admin-icons";
import {
  AdminMetricCard,
  type AdminMetricPresentation,
} from "@/components/admin/admin-metric-card";
import { AdminMetricsGrid } from "@/components/admin/admin-metrics-grid";
import { adminContactCopy } from "@/config/admin-contacts";
import { ADMIN_PATHS } from "@/config/admin-nav";
import { countContactMetrics } from "@/lib/admin/contacts";
import type {
  AdminContact,
  AdminContactPresentation,
} from "@/types/admin-contact";

interface ContactsMetricsProps {
  contacts: readonly AdminContact[];
  presentation: AdminContactPresentation;
}

export function ContactsMetrics({
  contacts,
  presentation,
}: ContactsMetricsProps): ReactElement {
  const counts = countContactMetrics(contacts);
  const cards: readonly {
    href: string;
    id: string;
    label: string;
    value: number;
  }[] = [
    {
      href: ADMIN_PATHS.contacts,
      id: "total",
      label: adminContactCopy.metricTotal,
      value: counts.total,
    },
    {
      href: `${ADMIN_PATHS.contacts}?status=NEW`,
      id: "new",
      label: adminContactCopy.metricNew,
      value: counts.new,
    },
    {
      href: `${ADMIN_PATHS.contacts}?status=READ`,
      id: "read",
      label: adminContactCopy.metricRead,
      value: counts.read,
    },
    {
      href: `${ADMIN_PATHS.contacts}?status=RESPONDED`,
      id: "responded",
      label: adminContactCopy.metricResponded,
      value: counts.responded,
    },
    {
      href: `${ADMIN_PATHS.contacts}?status=ARCHIVED`,
      id: "archived",
      label: adminContactCopy.metricArchived,
      value: counts.archived,
    },
  ];

  return (
    <AdminMetricsGrid>
      {cards.map((card) => (
        <AdminMetricCard
          href={card.href}
          icon={ContactsIcon}
          key={card.id}
          label={card.label}
          presentation={toMetricPresentation(
            presentation,
            card.value,
            contacts.length,
          )}
        />
      ))}
    </AdminMetricsGrid>
  );
}

function toMetricPresentation(
  presentation: AdminContactPresentation,
  value: number,
  contactCount: number,
): AdminMetricPresentation {
  if (presentation.status === "loading") {
    return { status: "loading" };
  }

  if (presentation.status === "error") {
    return { onRetry: presentation.onRetry, status: "error" };
  }

  if (presentation.status === "empty" || contactCount === 0) {
    return { status: "empty" };
  }

  return {
    status: "success",
    value: String(value),
  };
}

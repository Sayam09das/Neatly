"use client";

import { Card } from "@neatly/ui";
import { motion } from "framer-motion";
import type { ReactElement } from "react";
import { fadeUp } from "@/animations/motion/variants";
import { CleanerRowActions } from "@/components/admin/cleaners/cleaner-row-actions";
import { CleanerStatusBadge } from "@/components/admin/cleaners/cleaner-status-badge";
import { adminCleanerCopy } from "@/config/admin-cleaners";
import {
  formatCleanerCreatedDate,
  getCleanerNameLabel,
} from "@/lib/admin/cleaners";
import type { AdminCleaner } from "@/types/admin-cleaner";

interface CleanerCardProps {
  cleaner: AdminCleaner;
  onMutated?: () => void;
}

export function CleanerCard({
  cleaner,
  onMutated,
}: CleanerCardProps): ReactElement {
  return (
    <motion.article
      className="rounded-lg border border-border bg-surface p-4"
      data-slot="cleaner-card"
      variants={fadeUp}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-body-small font-medium text-foreground">
            {getCleanerNameLabel(cleaner.name)}
          </p>
          <p className="mt-1 truncate text-caption text-muted-foreground">
            {cleaner.email ?? adminCleanerCopy.emptyValue}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <CleanerStatusBadge label={cleaner.accountStateLabel} />
          <CleanerRowActions cleaner={cleaner} onMutated={onMutated} />
        </div>
      </div>
      <dl className="mt-3 grid grid-cols-1 gap-2">
        <CleanerCardField
          label={adminCleanerCopy.tablePhone}
          value={cleaner.phone ?? adminCleanerCopy.emptyValue}
        />
        <CleanerCardField
          label={adminCleanerCopy.tableCreated}
          value={formatCleanerCreatedDate(cleaner.createdAt)}
        />
      </dl>
    </motion.article>
  );
}

function CleanerCardField({
  label,
  value,
}: {
  label: string;
  value: string;
}): ReactElement {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-caption text-muted-foreground">{label}</dt>
      <dd className="truncate text-body-small text-foreground">{value}</dd>
    </div>
  );
}

interface CleanerCardListProps {
  cleaners: readonly AdminCleaner[];
  onMutated?: () => void;
}

export function CleanerCardList({
  cleaners,
  onMutated,
}: CleanerCardListProps): ReactElement {
  return (
    <Card
      className="flex flex-col gap-3 p-3 shadow-none md:hidden"
      data-slot="cleaner-card-list"
    >
      {cleaners.map((cleaner) => (
        <CleanerCard cleaner={cleaner} key={cleaner.id} onMutated={onMutated} />
      ))}
    </Card>
  );
}

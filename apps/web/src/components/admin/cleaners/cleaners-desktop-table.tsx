"use client";

import { Card } from "@neatly/ui";
import { motion } from "framer-motion";
import type { ReactElement } from "react";
import { fade } from "@/animations/motion/variants";
import { CleanerRowActions } from "@/components/admin/cleaners/cleaner-row-actions";
import { CleanerStatusBadge } from "@/components/admin/cleaners/cleaner-status-badge";
import { adminCleanerCopy } from "@/config/admin-cleaners";
import {
  formatCleanerCreatedDate,
  getCleanerNameLabel,
} from "@/lib/admin/cleaners";
import type { AdminCleaner } from "@/types/admin-cleaner";

interface CleanersDesktopTableProps {
  cleaners: readonly AdminCleaner[];
  onMutated?: () => void;
}

export function CleanersDesktopTable({
  cleaners,
  onMutated,
}: CleanersDesktopTableProps): ReactElement {
  return (
    <Card className="hidden overflow-x-auto shadow-none md:block">
      <table className="w-full min-w-0 border-collapse text-left">
        <caption className="sr-only">{adminCleanerCopy.tableLabel}</caption>
        <thead className="border-b border-border">
          <tr className="text-caption text-muted-foreground">
            <th className="px-4 py-3 font-medium" scope="col">
              {adminCleanerCopy.tableCleaner}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminCleanerCopy.tableContact}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminCleanerCopy.tablePhone}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminCleanerCopy.tableAccount}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminCleanerCopy.tableCreated}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminCleanerCopy.tableActions}
            </th>
          </tr>
        </thead>
        <tbody>
          {cleaners.map((cleaner) => (
            <CleanerTableRow
              cleaner={cleaner}
              key={cleaner.id}
              onMutated={onMutated}
            />
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function CleanerTableRow({
  cleaner,
  onMutated,
}: {
  cleaner: AdminCleaner;
  onMutated?: () => void;
}): ReactElement {
  return (
    <motion.tr
      className="border-b border-border last:border-b-0"
      data-slot="cleaner-table-row"
      variants={fade}
    >
      <td className="px-4 py-3 text-body-small text-foreground">
        {getCleanerNameLabel(cleaner.name)}
      </td>
      <td className="px-4 py-3 text-body-small text-foreground">
        {cleaner.email ?? adminCleanerCopy.emptyValue}
      </td>
      <td className="px-4 py-3 text-body-small text-foreground">
        {cleaner.phone ?? adminCleanerCopy.emptyValue}
      </td>
      <td className="px-4 py-3">
        <CleanerStatusBadge label={cleaner.accountStateLabel} />
      </td>
      <td className="px-4 py-3 text-body-small text-foreground">
        {formatCleanerCreatedDate(cleaner.createdAt)}
      </td>
      <td className="px-4 py-3">
        <CleanerRowActions cleaner={cleaner} onMutated={onMutated} />
      </td>
    </motion.tr>
  );
}

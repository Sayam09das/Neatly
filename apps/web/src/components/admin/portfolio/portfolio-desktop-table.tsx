"use client";

import { Card } from "@neatly/ui";
import { motion } from "framer-motion";
import type { ReactElement } from "react";
import { fade } from "@/animations/motion/variants";
import { PortfolioRowActions } from "@/components/admin/portfolio/portfolio-row-actions";
import { PortfolioStatusBadge } from "@/components/admin/portfolio/portfolio-status-badge";
import { adminPortfolioCopy } from "@/config/admin-portfolio";
import {
  formatPortfolioInstant,
  getPortfolioCategoryLabel,
  getPortfolioFeaturedLabel,
  getPortfolioLocation,
  getPortfolioTitle,
} from "@/lib/admin/portfolio";
import type { AdminPortfolioProject } from "@/types/admin-portfolio";

interface PortfolioDesktopTableProps {
  projects: readonly AdminPortfolioProject[];
}

export function PortfolioDesktopTable({
  projects,
}: PortfolioDesktopTableProps): ReactElement {
  return (
    <Card className="hidden overflow-x-auto shadow-none md:block">
      <table className="w-full min-w-0 border-collapse text-left">
        <caption className="sr-only">{adminPortfolioCopy.tableLabel}</caption>
        <thead className="border-b border-border">
          <tr className="text-caption text-muted-foreground">
            <th className="px-4 py-3 font-medium" scope="col">
              {adminPortfolioCopy.tableTitle}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminPortfolioCopy.tableCategory}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminPortfolioCopy.tableLocation}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminPortfolioCopy.tableStatus}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminPortfolioCopy.tableFeatured}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminPortfolioCopy.tableCreated}
            </th>
            <th className="px-4 py-3 font-medium" scope="col">
              {adminPortfolioCopy.tableActions}
            </th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <PortfolioTableRow key={project.id} project={project} />
          ))}
        </tbody>
      </table>
    </Card>
  );
}

interface PortfolioTableRowProps {
  project: AdminPortfolioProject;
}

function PortfolioTableRow({ project }: PortfolioTableRowProps): ReactElement {
  return (
    <motion.tr
      className="border-b border-border last:border-b-0"
      data-slot="portfolio-table-row"
      variants={fade}
    >
      <td className="px-4 py-3">
        <p className="truncate text-body-small text-foreground">
          {getPortfolioTitle(project.title)}
        </p>
        <p className="truncate text-caption text-muted-foreground">
          {project.slug}
        </p>
      </td>
      <td className="px-4 py-3 text-body-small text-foreground">
        {getPortfolioCategoryLabel(project.category)}
      </td>
      <td className="px-4 py-3 text-body-small text-foreground">
        {getPortfolioLocation(project.location)}
      </td>
      <td className="px-4 py-3">
        <PortfolioStatusBadge isPublished={project.isPublished} />
      </td>
      <td className="px-4 py-3 text-body-small text-foreground">
        {getPortfolioFeaturedLabel(project.isFeatured)}
      </td>
      <td className="px-4 py-3 text-body-small text-foreground">
        {formatPortfolioInstant(project.createdAt, { dateStyle: "medium" })}
      </td>
      <td className="px-4 py-3">
        <PortfolioRowActions project={project} />
      </td>
    </motion.tr>
  );
}

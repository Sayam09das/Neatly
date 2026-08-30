"use client";

import { Button, Card } from "@neatly/ui";
import { motion } from "framer-motion";
import Link from "next/link";
import type { ReactElement } from "react";
import { fadeUp } from "@/animations/motion/variants";
import { PortfolioRowActions } from "@/components/admin/portfolio/portfolio-row-actions";
import { PortfolioStatusBadge } from "@/components/admin/portfolio/portfolio-status-badge";
import {
  adminPortfolioCopy,
  getAdminPortfolioDetailsPath,
} from "@/config/admin-portfolio";
import {
  formatPortfolioInstant,
  getPortfolioCategoryLabel,
  getPortfolioFeaturedLabel,
  getPortfolioLocation,
  getPortfolioTitle,
} from "@/lib/admin/portfolio";
import type { AdminPortfolioProject } from "@/types/admin-portfolio";

interface PortfolioCardProps {
  project: AdminPortfolioProject;
}

export function PortfolioCard({ project }: PortfolioCardProps): ReactElement {
  return (
    <motion.article
      className="rounded-lg border border-border bg-surface p-4"
      data-slot="portfolio-card"
      variants={fadeUp}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-body-small font-medium text-foreground">
            {getPortfolioTitle(project.title)}
          </p>
          <p className="mt-1 truncate text-caption text-muted-foreground">
            {project.slug}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <PortfolioStatusBadge isPublished={project.isPublished} />
          <PortfolioRowActions project={project} />
        </div>
      </div>
      <dl className="mt-3 grid grid-cols-1 gap-2">
        <PortfolioCardField
          label={adminPortfolioCopy.tableCategory}
          value={getPortfolioCategoryLabel(project.category)}
        />
        <PortfolioCardField
          label={adminPortfolioCopy.tableLocation}
          value={getPortfolioLocation(project.location)}
        />
        <PortfolioCardField
          label={adminPortfolioCopy.tableFeatured}
          value={getPortfolioFeaturedLabel(project.isFeatured)}
        />
        <PortfolioCardField
          label={adminPortfolioCopy.tableCreated}
          value={formatPortfolioInstant(project.createdAt, {
            dateStyle: "medium",
          })}
        />
      </dl>
      <Button asChild className="mt-4 w-full" variant="outline">
        <Link href={getAdminPortfolioDetailsPath(project.id)}>
          {adminPortfolioCopy.viewAction}
        </Link>
      </Button>
    </motion.article>
  );
}

interface PortfolioCardFieldProps {
  label: string;
  value: string;
}

function PortfolioCardField({
  label,
  value,
}: PortfolioCardFieldProps): ReactElement {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-caption text-muted-foreground">{label}</dt>
      <dd className="truncate text-body-small text-foreground">{value}</dd>
    </div>
  );
}

interface PortfolioCardListProps {
  projects: readonly AdminPortfolioProject[];
}

export function PortfolioCardList({
  projects,
}: PortfolioCardListProps): ReactElement {
  return (
    <Card
      className="flex flex-col gap-3 p-3 shadow-none md:hidden"
      data-slot="portfolio-card-list"
    >
      {projects.map((project) => (
        <PortfolioCard key={project.id} project={project} />
      ))}
    </Card>
  );
}

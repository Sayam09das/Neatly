"use client";

import { Button, Card } from "@neatly/ui";
import Link from "next/link";
import type { ReactElement } from "react";
import {
  AdminDashboardBlock,
  AdminDashboardMotion,
} from "@/components/admin/admin-dashboard-motion";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { PortfolioIcon } from "@/components/admin/admin-icons";
import { AdminRetryState } from "@/components/admin/admin-retry-state";
import { PortfolioLoading } from "@/components/admin/portfolio/portfolio-states";
import { PortfolioStatusBadge } from "@/components/admin/portfolio/portfolio-status-badge";
import { ADMIN_PATHS } from "@/config/admin-nav";
import { adminPortfolioCopy } from "@/config/admin-portfolio";
import {
  formatPortfolioInstant,
  getAdminPortfolioProject,
  getPortfolioCategoryLabel,
  getPortfolioFeaturedLabel,
  getPortfolioLocation,
  getPortfolioTitle,
} from "@/lib/admin/portfolio";
import { useAdminQuery } from "@/lib/admin/use-admin-query";
import { useAdminRefresh } from "@/lib/admin/use-admin-refresh";
import type {
  AdminPortfolioDetailsPresentation,
  AdminPortfolioProject,
} from "@/types/admin-portfolio";

interface AdminPortfolioDetailsProps {
  presentation?: AdminPortfolioDetailsPresentation;
  projectId: string;
}

export function AdminPortfolioDetails({
  presentation,
  projectId,
}: AdminPortfolioDetailsProps): ReactElement {
  if (presentation !== undefined) {
    return (
      <PortfolioDetails presentation={presentation} projectId={projectId} />
    );
  }

  return <AdminPortfolioDetailsLive projectId={projectId} />;
}

function AdminPortfolioDetailsLive({
  projectId,
}: {
  projectId: string;
}): ReactElement {
  const query = useAdminQuery({
    enabled: true,
    request: (signal) => getAdminPortfolioProject(projectId, { signal }),
    requestKey: `portfolio-${projectId}`,
  });
  useAdminRefresh("portfolio", query.retry);

  if (query.status === "loading") {
    return (
      <PortfolioDetails
        presentation={{ status: "loading" }}
        projectId={projectId}
      />
    );
  }

  if (query.status === "error") {
    return (
      <PortfolioDetails
        presentation={{ onRetry: query.retry, status: "error" }}
        projectId={projectId}
      />
    );
  }

  if (query.data === null) {
    return (
      <PortfolioDetails
        presentation={{ status: "empty" }}
        projectId={projectId}
      />
    );
  }

  return (
    <PortfolioDetails
      presentation={{ project: query.data, status: "ready" }}
      projectId={projectId}
    />
  );
}

interface PortfolioDetailsProps {
  presentation: AdminPortfolioDetailsPresentation;
  projectId: string;
}

export function PortfolioDetails({
  presentation,
  projectId,
}: PortfolioDetailsProps): ReactElement {
  return (
    <div
      className="mx-auto w-full min-w-0 max-w-page"
      data-slot="admin-portfolio-details"
    >
      <AdminDashboardMotion>
        <AdminDashboardBlock>
          <header className="max-w-prose">
            <p className="text-caption text-muted-foreground">{projectId}</p>
            <h1 className="mt-2 text-h1 text-foreground tracking-tight">
              {adminPortfolioCopy.detailsHeading}
            </h1>
            <p className="mt-3 text-body text-muted-foreground">
              {adminPortfolioCopy.detailsDescription}
            </p>
            <Button asChild className="mt-6" variant="outline">
              <Link href={ADMIN_PATHS.portfolio}>
                {adminPortfolioCopy.backToPortfolio}
              </Link>
            </Button>
          </header>
        </AdminDashboardBlock>
        <AdminDashboardBlock>
          <PortfolioDetailsBody presentation={presentation} />
        </AdminDashboardBlock>
      </AdminDashboardMotion>
    </div>
  );
}

interface PortfolioDetailsBodyProps {
  presentation: AdminPortfolioDetailsPresentation;
}

function PortfolioDetailsBody({
  presentation,
}: PortfolioDetailsBodyProps): ReactElement {
  if (presentation.status === "loading") {
    return (
      <Card className="p-6 shadow-none">
        <PortfolioLoading />
      </Card>
    );
  }

  if (presentation.status === "error") {
    return (
      <Card className="p-6 shadow-none">
        <AdminRetryState
          actionLabel={adminPortfolioCopy.retryLabel}
          description={adminPortfolioCopy.errorDescription}
          onRetry={presentation.onRetry}
          title={adminPortfolioCopy.errorTitle}
        />
      </Card>
    );
  }

  if (presentation.status === "empty") {
    return (
      <Card className="p-6 shadow-none">
        <AdminEmptyState
          description={adminPortfolioCopy.detailsNotFoundDescription}
          icon={PortfolioIcon}
          title={adminPortfolioCopy.detailsNotFoundTitle}
        />
      </Card>
    );
  }

  return <PortfolioDetailsContent project={presentation.project} />;
}

interface PortfolioDetailsContentProps {
  project: AdminPortfolioProject;
}

function PortfolioDetailsContent({
  project,
}: PortfolioDetailsContentProps): ReactElement {
  const showUpdated = project.updatedAt !== project.createdAt;

  return (
    <div className="flex flex-col gap-4">
      <Card className="p-6 shadow-none">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-h3 text-foreground tracking-tight">
              {getPortfolioTitle(project.title)}
            </h2>
            <p className="mt-1 text-caption text-muted-foreground">
              {project.slug}
            </p>
          </div>
          <PortfolioStatusBadge isPublished={project.isPublished} />
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button disabled type="button" variant="outline">
            {adminPortfolioCopy.editAction}
          </Button>
        </div>
        <p className="mt-2 text-caption text-muted-foreground">
          {adminPortfolioCopy.createUnavailable}
        </p>
      </Card>
      <Card className="p-6 shadow-none">
        <h2 className="text-h3 text-foreground tracking-tight">
          {adminPortfolioCopy.projectSection}
        </h2>
        <DetailList
          items={[
            {
              label: adminPortfolioCopy.tableTitle,
              value: getPortfolioTitle(project.title),
            },
            {
              label: adminPortfolioCopy.slugLabel,
              value: project.slug,
            },
            {
              label: adminPortfolioCopy.categoryLabel,
              value: getPortfolioCategoryLabel(project.category),
            },
            {
              label: adminPortfolioCopy.locationLabel,
              value: getPortfolioLocation(project.location),
            },
            {
              label: adminPortfolioCopy.sortOrderLabel,
              value: String(project.sortOrder),
            },
          ]}
        />
        <div className="mt-4">
          <p className="text-caption text-muted-foreground">
            {adminPortfolioCopy.descriptionLabel}
          </p>
          <p className="mt-2 whitespace-pre-wrap text-body-small text-foreground">
            {project.description}
          </p>
        </div>
      </Card>
      <Card className="p-6 shadow-none">
        <h2 className="text-h3 text-foreground tracking-tight">
          {adminPortfolioCopy.statusSection}
        </h2>
        <DetailList
          items={[
            {
              label: adminPortfolioCopy.featuredLabel,
              value: getPortfolioFeaturedLabel(project.isFeatured),
            },
          ]}
        />
        <div className="mt-4">
          <PortfolioStatusBadge isPublished={project.isPublished} />
        </div>
      </Card>
      <Card className="p-6 shadow-none">
        <h2 className="text-h3 text-foreground tracking-tight">
          {adminPortfolioCopy.imagesSection}
        </h2>
        <p className="mt-4 text-body-small text-muted-foreground">
          {adminPortfolioCopy.imagesEmpty}
        </p>
      </Card>
      <Card className="p-6 shadow-none">
        <h2 className="text-h3 text-foreground tracking-tight">
          {adminPortfolioCopy.timelineSection}
        </h2>
        <DetailList
          items={[
            {
              label: adminPortfolioCopy.timelineCreated,
              value: formatPortfolioInstant(project.createdAt, {
                dateStyle: "medium",
                timeStyle: "short",
              }),
            },
            ...(showUpdated
              ? [
                  {
                    label: adminPortfolioCopy.timelineUpdated,
                    value: formatPortfolioInstant(project.updatedAt, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }),
                  },
                ]
              : []),
          ]}
        />
      </Card>
    </div>
  );
}

interface DetailListProps {
  items: readonly { label: string; value: string }[];
}

function DetailList({ items }: DetailListProps): ReactElement {
  return (
    <dl className="mt-4 grid gap-3">
      {items.map((item) => (
        <div
          className="grid gap-1 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-4"
          key={item.label}
        >
          <dt className="text-caption text-muted-foreground">{item.label}</dt>
          <dd className="whitespace-pre-wrap text-body-small text-foreground">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

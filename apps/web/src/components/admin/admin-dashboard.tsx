import { Card } from "@neatly/ui";
import type { ComponentType, ReactElement, SVGProps } from "react";
import { AdminActivityList } from "@/components/admin/admin-activity-list";
import {
  AdminDashboardBlock,
  AdminDashboardMotion,
} from "@/components/admin/admin-dashboard-motion";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import {
  BlogIcon,
  ContactsIcon,
  OverviewIcon,
  PortfolioIcon,
  QuotesIcon,
  ServicesIcon,
} from "@/components/admin/admin-icons";
import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { AdminMetricsGrid } from "@/components/admin/admin-metrics-grid";
import { AdminQuickAction } from "@/components/admin/admin-quick-action";
import { AdminSection } from "@/components/admin/admin-section";
import {
  adminDashboardCopy,
  adminDashboardMetrics,
  adminDashboardQuickActions,
} from "@/config/admin-dashboard";
import type { AdminNavIconName } from "@/config/admin-nav";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const dashboardIcons: Partial<Record<AdminNavIconName, IconComponent>> = {
  blog: BlogIcon,
  contacts: ContactsIcon,
  portfolio: PortfolioIcon,
  quotes: QuotesIcon,
  services: ServicesIcon,
};

function getDashboardIcon(name: AdminNavIconName): IconComponent {
  const icon = dashboardIcons[name];

  if (icon === undefined) {
    return OverviewIcon;
  }

  return icon;
}

export function AdminDashboard(): ReactElement {
  return (
    <div className="mx-auto w-full min-w-0 max-w-page">
      <AdminDashboardMotion>
        <AdminDashboardBlock>
          <header className="max-w-prose">
            <h1 className="text-h1 text-foreground tracking-tight">
              {adminDashboardCopy.heading}
            </h1>
            <p className="mt-3 text-body text-muted-foreground">
              {adminDashboardCopy.description}
            </p>
          </header>
        </AdminDashboardBlock>

        <AdminDashboardBlock>
          <AdminSection
            description={adminDashboardCopy.metricsDescription}
            title={adminDashboardCopy.metricsHeading}
          >
            <AdminMetricsGrid>
              {adminDashboardMetrics.map((metric) => (
                <AdminMetricCard
                  icon={getDashboardIcon(metric.icon)}
                  key={metric.id}
                  label={metric.label}
                  presentation={{ status: "empty" }}
                />
              ))}
            </AdminMetricsGrid>
          </AdminSection>
        </AdminDashboardBlock>

        <AdminDashboardBlock>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch">
            <AdminSection
              description={adminDashboardCopy.operationsDescription}
              title={adminDashboardCopy.operationsHeading}
            >
              <Card className="flex min-h-48 flex-col justify-center p-6 shadow-none">
                <AdminEmptyState
                  description={adminDashboardCopy.operationsEmptyDescription}
                  icon={OverviewIcon}
                  title={adminDashboardCopy.operationsEmptyTitle}
                />
              </Card>
            </AdminSection>

            <AdminSection
              description={adminDashboardCopy.activityDescription}
              title={adminDashboardCopy.activityHeading}
            >
              <AdminActivityList presentation={{ status: "empty" }} />
            </AdminSection>
          </div>
        </AdminDashboardBlock>

        <AdminDashboardBlock>
          <AdminSection
            description={adminDashboardCopy.quickActionsDescription}
            title={adminDashboardCopy.quickActionsHeading}
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {adminDashboardQuickActions.map((action) => (
                <AdminQuickAction
                  description={action.description}
                  href={action.href}
                  icon={getDashboardIcon(action.icon)}
                  key={action.href}
                  title={action.title}
                />
              ))}
            </div>
          </AdminSection>
        </AdminDashboardBlock>
      </AdminDashboardMotion>
    </div>
  );
}

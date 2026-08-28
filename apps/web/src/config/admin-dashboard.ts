import { ADMIN_PATHS, type AdminNavIconName } from "@/config/admin-nav";
import { adminHomeCopy } from "@/config/admin-ui";

export const adminDashboardCopy = {
  activityDescription:
    "Incoming quotes and inquiries will list here as they arrive.",
  activityEmptyDescription:
    "Your dashboard will update as quotes and inquiries move through Neatly.",
  activityEmptyTitle: "No recent activity yet",
  activityHeading: "Recent activity",
  description: adminHomeCopy.description,
  emptyValue: "—",
  emptyValueLabel: "No data yet",
  errorDescription: "The overview could not be shown. You can try again.",
  errorTitle: "Unable to load your overview.",
  heading: adminHomeCopy.heading,
  loadingLabel: "Loading overview",
  metricErrorLabel: "Unable to load",
  metricsDescription:
    "These counts will fill in once quotes, inquiries, and published content are available.",
  metricsHeading: "Overview",
  trendDecreaseLabel: "Decrease compared with previous period",
  trendIncreaseLabel: "Increase compared with previous period",
  trendNeutralLabel: "No change compared with previous period",
  operationsDescription:
    "A summary of quote flow and inbox activity will appear here.",
  operationsEmptyDescription:
    "Quote requests and contact inquiries will appear here as they arrive.",
  operationsEmptyTitle: "No operational activity yet",
  operationsHeading: "Operational overview",
  quickActionsDescription: "Jump to the areas you will use most often.",
  quickActionsHeading: "Quick actions",
  retryLabel: "Try again",
} as const;

export interface AdminDashboardMetricConfig {
  icon: AdminNavIconName;
  id: string;
  label: string;
}

export const adminDashboardMetrics: readonly AdminDashboardMetricConfig[] = [
  {
    icon: "quotes",
    id: "quotes",
    label: "New quote requests",
  },
  {
    icon: "contacts",
    id: "contacts",
    label: "Pending inquiries",
  },
  {
    icon: "services",
    id: "services",
    label: "Active services",
  },
  {
    icon: "blog",
    id: "articles",
    label: "Published articles",
  },
] as const;

export interface AdminDashboardQuickActionConfig {
  description: string;
  href: string;
  icon: AdminNavIconName;
  title: string;
}

export const adminDashboardQuickActions: readonly AdminDashboardQuickActionConfig[] =
  [
    {
      description: "Review and update incoming quote requests.",
      href: ADMIN_PATHS.quotes,
      icon: "quotes",
      title: "Quotes",
    },
    {
      description: "Read and follow up on contact inquiries.",
      href: ADMIN_PATHS.contacts,
      icon: "contacts",
      title: "Contacts",
    },
    {
      description: "Manage the published service catalog.",
      href: ADMIN_PATHS.services,
      icon: "services",
      title: "Services",
    },
    {
      description: "Update before-and-after project work.",
      href: ADMIN_PATHS.portfolio,
      icon: "portfolio",
      title: "Portfolio",
    },
  ] as const;

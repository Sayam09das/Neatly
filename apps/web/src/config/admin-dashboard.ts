import { ADMIN_PATHS, type AdminNavIconName } from "@/config/admin-nav";
import { adminHomeCopy } from "@/config/admin-ui";

export const adminDashboardCopy = {
  activityDescription:
    "Recent bookings and customers from the Admin API appear here.",
  activityEmptyDescription:
    "Your dashboard will update as bookings and customers are added.",
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
    "These counts come from live customer, booking, service, and review records.",
  metricsHeading: "Overview",
  trendDecreaseLabel: "Decrease compared with previous period",
  trendIncreaseLabel: "Increase compared with previous period",
  trendNeutralLabel: "No change compared with previous period",
  operationsDescription: "The latest bookings from the operations queue.",
  operationsEmptyDescription:
    "Bookings will appear here once customers begin scheduling work.",
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
    icon: "customers",
    id: "customers",
    label: "Customers",
  },
  {
    icon: "bookings",
    id: "bookings",
    label: "Bookings",
  },
  {
    icon: "services",
    id: "services",
    label: "Active services",
  },
  {
    icon: "reviews",
    id: "reviews",
    label: "Reviews",
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

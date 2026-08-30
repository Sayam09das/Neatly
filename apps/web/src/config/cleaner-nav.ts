import { CLEANER_HOME_PATH, CLEANER_PATHS } from "@/config/cleaner";

export type CleanerNavGroupId = "overview" | "work" | "account" | "support";

export type CleanerNavIconName =
  | "availability"
  | "dashboard"
  | "help"
  | "jobs"
  | "notifications"
  | "profile"
  | "schedule"
  | "settings";

export interface CleanerNavItem {
  href: string;
  icon: CleanerNavIconName;
  label: string;
}

export interface CleanerNavGroup {
  id: CleanerNavGroupId;
  items: readonly CleanerNavItem[];
  label: string;
}

export const CLEANER_NAV_GROUP_LABELS: Record<CleanerNavGroupId, string> = {
  account: "Account",
  overview: "Overview",
  support: "Support",
  work: "Work",
};

export const cleanerNavigation: readonly CleanerNavGroup[] = [
  {
    id: "overview",
    items: [
      {
        href: CLEANER_PATHS.dashboard,
        icon: "dashboard",
        label: "Dashboard",
      },
    ],
    label: CLEANER_NAV_GROUP_LABELS.overview,
  },
  {
    id: "work",
    items: [
      {
        href: CLEANER_PATHS.jobs,
        icon: "jobs",
        label: "Jobs",
      },
      {
        href: CLEANER_PATHS.schedule,
        icon: "schedule",
        label: "Schedule",
      },
      {
        href: CLEANER_PATHS.availability,
        icon: "availability",
        label: "Availability",
      },
    ],
    label: CLEANER_NAV_GROUP_LABELS.work,
  },
  {
    id: "account",
    items: [
      {
        href: CLEANER_PATHS.notifications,
        icon: "notifications",
        label: "Notifications",
      },
      {
        href: CLEANER_PATHS.profile,
        icon: "profile",
        label: "Profile",
      },
      {
        href: CLEANER_PATHS.settings,
        icon: "settings",
        label: "Settings",
      },
    ],
    label: CLEANER_NAV_GROUP_LABELS.account,
  },
  {
    id: "support",
    items: [
      {
        href: CLEANER_PATHS.help,
        icon: "help",
        label: "Help & Support",
      },
    ],
    label: CLEANER_NAV_GROUP_LABELS.support,
  },
] as const;

export const cleanerAppNavigation: readonly CleanerNavItem[] =
  cleanerNavigation.flatMap((group) => group.items);

export const cleanerAccountMenuItems: readonly CleanerNavItem[] = [
  {
    href: CLEANER_PATHS.profile,
    icon: "profile",
    label: "Profile",
  },
  {
    href: CLEANER_PATHS.settings,
    icon: "settings",
    label: "Settings",
  },
] as const;

export function getCleanerNavItems(): readonly CleanerNavItem[] {
  return cleanerAppNavigation;
}

export function getVisibleCleanerNavItems(): readonly CleanerNavItem[] {
  return cleanerAppNavigation;
}

export function getVisibleCleanerNavGroups(): readonly CleanerNavGroup[] {
  return cleanerNavigation;
}

export function isCleanerDashboardPath(pathname: string): boolean {
  return pathname === CLEANER_HOME_PATH || pathname === CLEANER_PATHS.dashboard;
}

export function isCleanerNavItemActive(
  pathname: string | null,
  href: string,
): boolean {
  if (pathname === null || pathname === "") {
    return false;
  }

  if (href === CLEANER_PATHS.dashboard || href === CLEANER_HOME_PATH) {
    return isCleanerDashboardPath(pathname);
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getCleanerPageTitle(pathname: string): string {
  const match = getCleanerNavItems()
    .filter((item) => isCleanerNavItemActive(pathname, item.href))
    .sort((left, right) => right.href.length - left.href.length)[0];

  if (match === undefined) {
    return "Cleaner";
  }

  return match.label;
}

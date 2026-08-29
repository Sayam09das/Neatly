import { CLEANER_HOME_PATH, CLEANER_PATHS } from "@/config/cleaner";

export type CleanerNavGroup = "workspace" | "activity" | "account";

export interface CleanerNavItem {
  available: boolean;
  group: CleanerNavGroup;
  href: string;
  label: string;
}

export const CLEANER_NAV_GROUP_LABELS: Record<CleanerNavGroup, string> = {
  account: "Account",
  activity: "Activity",
  workspace: "Workspace",
};

export const cleanerAppNavigation: readonly CleanerNavItem[] = [
  {
    available: true,
    group: "workspace",
    href: CLEANER_PATHS.home,
    label: "Overview",
  },
  {
    available: true,
    group: "workspace",
    href: CLEANER_PATHS.jobs,
    label: "Jobs",
  },
  {
    available: true,
    group: "workspace",
    href: CLEANER_PATHS.schedule,
    label: "Schedule",
  },
  {
    available: true,
    group: "workspace",
    href: CLEANER_PATHS.availability,
    label: "Availability",
  },
  {
    available: false,
    group: "workspace",
    href: CLEANER_PATHS.earnings,
    label: "Earnings",
  },
  {
    available: false,
    group: "activity",
    href: CLEANER_PATHS.reviews,
    label: "Reviews",
  },
  {
    available: false,
    group: "activity",
    href: CLEANER_PATHS.notifications,
    label: "Notifications",
  },
  {
    available: false,
    group: "account",
    href: CLEANER_PATHS.profile,
    label: "Profile",
  },
  {
    available: false,
    group: "account",
    href: CLEANER_PATHS.settings,
    label: "Settings",
  },
  {
    available: false,
    group: "account",
    href: CLEANER_PATHS.help,
    label: "Help",
  },
] as const;

export const cleanerAccountMenuItems: readonly CleanerNavItem[] = [
  {
    available: false,
    group: "account",
    href: CLEANER_PATHS.profile,
    label: "Profile",
  },
  {
    available: false,
    group: "account",
    href: CLEANER_PATHS.settings,
    label: "Settings",
  },
] as const;

export function getCleanerNavItems(): readonly CleanerNavItem[] {
  return cleanerAppNavigation;
}

export function getVisibleCleanerNavItems(): readonly CleanerNavItem[] {
  return cleanerAppNavigation.filter((item) => item.available);
}

export function getVisibleCleanerNavGroups(): readonly {
  id: CleanerNavGroup;
  items: readonly CleanerNavItem[];
  label: string;
}[] {
  const order: readonly CleanerNavGroup[] = [
    "workspace",
    "activity",
    "account",
  ];

  return order
    .map((id) => ({
      id,
      items: getVisibleCleanerNavItems().filter((item) => item.group === id),
      label: CLEANER_NAV_GROUP_LABELS[id],
    }))
    .filter((group) => group.items.length > 0);
}

export function isCleanerNavItemActive(
  pathname: string | null,
  href: string,
): boolean {
  if (pathname === null || pathname === "") {
    return false;
  }

  if (href === CLEANER_HOME_PATH) {
    return pathname === CLEANER_HOME_PATH;
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

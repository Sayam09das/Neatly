import { CUSTOMER_HOME_PATH, CUSTOMER_PATHS } from "@/config/customer";

export type CustomerNavGroupId = "overview" | "booking" | "account" | "support";

export type CustomerNavIconName =
  | "bookings"
  | "dashboard"
  | "help"
  | "notifications"
  | "profile"
  | "quotes"
  | "services"
  | "settings";

export interface CustomerNavDestination {
  href: string;
  label: string;
}

export interface CustomerNavItem extends CustomerNavDestination {
  icon: CustomerNavIconName;
}

export interface CustomerNavGroup {
  id: CustomerNavGroupId;
  items: readonly CustomerNavItem[];
  label: string;
}

export const CUSTOMER_NAV_GROUP_LABELS: Record<CustomerNavGroupId, string> = {
  account: "Account",
  booking: "Booking",
  overview: "Overview",
  support: "Support",
};

export const customerNavigation: readonly CustomerNavGroup[] = [
  {
    id: "overview",
    items: [
      {
        href: CUSTOMER_PATHS.dashboard,
        icon: "dashboard",
        label: "Dashboard",
      },
    ],
    label: CUSTOMER_NAV_GROUP_LABELS.overview,
  },
  {
    id: "booking",
    items: [
      {
        href: CUSTOMER_PATHS.dashboardServices,
        icon: "services",
        label: "Services",
      },
      {
        href: CUSTOMER_PATHS.quotes,
        icon: "quotes",
        label: "My Quotes",
      },
      {
        href: CUSTOMER_PATHS.bookings,
        icon: "bookings",
        label: "My Bookings",
      },
    ],
    label: CUSTOMER_NAV_GROUP_LABELS.booking,
  },
  {
    id: "account",
    items: [
      {
        href: CUSTOMER_PATHS.notifications,
        icon: "notifications",
        label: "Notifications",
      },
      {
        href: CUSTOMER_PATHS.profile,
        icon: "profile",
        label: "Profile",
      },
      {
        href: CUSTOMER_PATHS.settings,
        icon: "settings",
        label: "Settings",
      },
    ],
    label: CUSTOMER_NAV_GROUP_LABELS.account,
  },
  {
    id: "support",
    items: [
      {
        href: CUSTOMER_PATHS.help,
        icon: "help",
        label: "Help & Support",
      },
    ],
    label: CUSTOMER_NAV_GROUP_LABELS.support,
  },
] as const;

export const customerAppNavigation: readonly CustomerNavItem[] =
  customerNavigation.flatMap((group) => group.items);

export const customerHeaderNavigation: readonly CustomerNavDestination[] = [
  { href: CUSTOMER_PATHS.dashboard, label: "Overview" },
  { href: CUSTOMER_PATHS.bookings, label: "Bookings" },
] as const;

export const customerAccountMenuItems: readonly CustomerNavDestination[] = [
  { href: CUSTOMER_PATHS.profile, label: "Profile" },
  { href: CUSTOMER_PATHS.settings, label: "Settings" },
] as const;

export const customerFooterAccountLinks: readonly CustomerNavDestination[] = [
  { href: CUSTOMER_PATHS.dashboard, label: "Overview" },
  { href: CUSTOMER_PATHS.bookings, label: "Bookings" },
  { href: CUSTOMER_PATHS.help, label: "Help" },
] as const;

export function getCustomerNavItems(): readonly CustomerNavItem[] {
  return customerAppNavigation;
}

export function getVisibleCustomerNavGroups(): readonly CustomerNavGroup[] {
  return customerNavigation;
}

export function isCustomerDashboardPath(pathname: string): boolean {
  return (
    pathname === CUSTOMER_HOME_PATH || pathname === CUSTOMER_PATHS.dashboard
  );
}

export function isCustomerNavItemActive(
  pathname: string | null,
  href: string,
): boolean {
  if (pathname === null || pathname === "") {
    return false;
  }

  if (href === CUSTOMER_PATHS.dashboard) {
    return isCustomerDashboardPath(pathname);
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getCustomerPageTitle(pathname: string): string {
  const match = getCustomerNavItems()
    .filter((item) => isCustomerNavItemActive(pathname, item.href))
    .sort((left, right) => right.href.length - left.href.length)[0];

  if (match !== undefined) {
    return match.label;
  }

  if (isCustomerNavItemActive(pathname, CUSTOMER_PATHS.reviews)) {
    return "Reviews";
  }

  return "Your account";
}

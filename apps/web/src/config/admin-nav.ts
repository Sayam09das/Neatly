import { ADMIN_HOME_PATH, adminHeaderCopy } from "@/config/admin-ui";

export const ADMIN_PATHS = {
  blog: "/admin/blog",
  bookings: "/admin/bookings",
  cleaners: "/admin/cleaners",
  contacts: "/admin/contacts",
  customers: "/admin/customers",
  home: ADMIN_HOME_PATH,
  newsletter: "/admin/newsletter",
  notifications: "/admin/notifications",
  portfolio: "/admin/portfolio",
  quotes: "/admin/quotes",
  reviews: "/admin/reviews",
  services: "/admin/services",
  settings: "/admin/settings",
  testimonials: "/admin/testimonials",
} as const;

export const ADMIN_SIDEBAR_EXPANDED_WIDTH = "16rem";
export const ADMIN_SIDEBAR_COLLAPSED_WIDTH = "4rem";
export const ADMIN_MOBILE_NAV_ID = "admin-mobile-navigation";

export type AdminNavIconName =
  | "blog"
  | "bookings"
  | "cleaners"
  | "contacts"
  | "customers"
  | "newsletter"
  | "notifications"
  | "overview"
  | "portfolio"
  | "quotes"
  | "reviews"
  | "services"
  | "settings"
  | "testimonials";

export interface AdminNavItem {
  href: string;
  icon: AdminNavIconName;
  label: string;
}

export interface AdminNavGroup {
  id: string;
  items: readonly AdminNavItem[];
  label: string;
}

export const adminNavigation: readonly AdminNavGroup[] = [
  {
    id: "overview",
    items: [
      {
        href: ADMIN_PATHS.home,
        icon: "overview",
        label: "Overview",
      },
    ],
    label: "Overview",
  },
  {
    id: "operations",
    items: [
      {
        href: ADMIN_PATHS.bookings,
        icon: "bookings",
        label: "Bookings",
      },
      {
        href: ADMIN_PATHS.customers,
        icon: "customers",
        label: "Customers",
      },
      {
        href: ADMIN_PATHS.cleaners,
        icon: "cleaners",
        label: "Cleaners",
      },
      {
        href: ADMIN_PATHS.quotes,
        icon: "quotes",
        label: "Quotes",
      },
      {
        href: ADMIN_PATHS.contacts,
        icon: "contacts",
        label: "Contacts",
      },
    ],
    label: "Operations",
  },
  {
    id: "content",
    items: [
      {
        href: ADMIN_PATHS.services,
        icon: "services",
        label: "Services",
      },
      {
        href: ADMIN_PATHS.portfolio,
        icon: "portfolio",
        label: "Portfolio",
      },
      {
        href: ADMIN_PATHS.reviews,
        icon: "reviews",
        label: "Reviews",
      },
      {
        href: ADMIN_PATHS.blog,
        icon: "blog",
        label: "Blog",
      },
    ],
    label: "Content",
  },
  {
    id: "system",
    items: [
      {
        href: ADMIN_PATHS.newsletter,
        icon: "newsletter",
        label: "Newsletter",
      },
      {
        href: ADMIN_PATHS.notifications,
        icon: "notifications",
        label: "Notifications",
      },
      {
        href: ADMIN_PATHS.settings,
        icon: "settings",
        label: "Settings",
      },
    ],
    label: "System",
  },
] as const;

export function getAdminNavItems(): readonly AdminNavItem[] {
  return adminNavigation.flatMap((group) => group.items);
}

export function isAdminNavItemActive(pathname: string, href: string): boolean {
  if (href === ADMIN_PATHS.home) {
    return pathname === ADMIN_PATHS.home;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getAdminPageTitle(pathname: string): string {
  const match = getAdminNavItems()
    .filter((item) => isAdminNavItemActive(pathname, item.href))
    .sort((left, right) => right.href.length - left.href.length)[0];

  if (match === undefined || match.href === ADMIN_PATHS.home) {
    return adminHeaderCopy.homeTitle;
  }

  return match.label;
}

import { CUSTOMER_PATHS } from "@/config/customer";

export interface CustomerNavItem {
  href: string;
  label: string;
}

export const customerAppNavigation: readonly CustomerNavItem[] = [
  { href: CUSTOMER_PATHS.dashboard, label: "Overview" },
  { href: CUSTOMER_PATHS.bookings, label: "Bookings" },
  { href: CUSTOMER_PATHS.reviews, label: "Reviews" },
  { href: CUSTOMER_PATHS.help, label: "Help" },
  { href: CUSTOMER_PATHS.services, label: "Services" },
] as const;

export const customerNavigation: readonly CustomerNavItem[] =
  customerAppNavigation;

export const customerHeaderNavigation: readonly CustomerNavItem[] = [
  { href: CUSTOMER_PATHS.dashboard, label: "Overview" },
  { href: CUSTOMER_PATHS.bookings, label: "Bookings" },
] as const;

export const customerAccountMenuItems: readonly CustomerNavItem[] = [
  { href: CUSTOMER_PATHS.profile, label: "Profile" },
  { href: CUSTOMER_PATHS.settings, label: "Settings" },
] as const;

export const customerFooterAccountLinks: readonly CustomerNavItem[] = [
  { href: CUSTOMER_PATHS.dashboard, label: "Overview" },
  { href: CUSTOMER_PATHS.bookings, label: "Bookings" },
  { href: CUSTOMER_PATHS.help, label: "Help" },
] as const;

export function getCustomerNavItems(): readonly CustomerNavItem[] {
  return customerNavigation;
}

export function isCustomerNavItemActive(
  pathname: string | null,
  href: string,
): boolean {
  if (pathname === null || pathname === "") {
    return false;
  }

  if (href === CUSTOMER_PATHS.dashboard) {
    return pathname === CUSTOMER_PATHS.dashboard;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getCustomerPageTitle(pathname: string): string {
  const match = getCustomerNavItems()
    .filter((item) => isCustomerNavItemActive(pathname, item.href))
    .sort((left, right) => right.href.length - left.href.length)[0];

  if (match === undefined) {
    return "Your account";
  }

  return match.label;
}

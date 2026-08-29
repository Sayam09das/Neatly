import { AUTH_ADMIN_HOME_PATH } from "@/config/auth";
import {
  customerAppNavigation,
  customerHeaderNavigation,
} from "@/config/customer-nav";
import { landingNavLinks } from "@/config/landing";
import type { AuthUser } from "@/types/auth";

export const ADMIN_NAVBAR_ROLES = [
  "ADMIN",
  "CONTENT_MANAGER",
  "STAFF",
  "SUPER_ADMIN",
] as const;

export type CustomerNavbarArea = "account" | "public";

export type CustomerNavbarMode = "admin" | "customer" | "guest";

export interface CustomerNavbarIdentity {
  email: string;
  name: string;
}

export interface CustomerNavbarSession {
  identity: CustomerNavbarIdentity;
  role: string;
}

export interface CustomerNavbarPresentation {
  accountLinks: readonly { href: string; label: string }[];
  mode: CustomerNavbarMode;
  primaryLinks: readonly { href: string; label: string }[];
  showAdmin: boolean;
  showLogin: boolean;
  showNotifications: boolean;
  showQuote: boolean;
  showUserMenu: boolean;
}

export function isAdminNavbarRole(role: string): boolean {
  return (ADMIN_NAVBAR_ROLES as readonly string[]).includes(role);
}

export function toCustomerNavbarSession(
  user: AuthUser | null,
): CustomerNavbarSession | null {
  if (user === null) {
    return null;
  }

  return {
    identity: {
      email: user.email,
      name: user.name,
    },
    role: user.role,
  };
}

export function getCustomerNavbarMode(
  session: CustomerNavbarSession | null,
  area: CustomerNavbarArea,
): CustomerNavbarMode {
  if (session === null) {
    return "guest";
  }

  if (area === "account") {
    return "customer";
  }

  if (isAdminNavbarRole(session.role)) {
    return "admin";
  }

  return "customer";
}

export function getCustomerNavbarPresentation(
  session: CustomerNavbarSession | null,
  area: CustomerNavbarArea,
): CustomerNavbarPresentation {
  const mode = getCustomerNavbarMode(session, area);

  if (mode === "guest") {
    return {
      accountLinks: [],
      mode,
      primaryLinks: landingNavLinks,
      showAdmin: false,
      showLogin: true,
      showNotifications: false,
      showQuote: true,
      showUserMenu: false,
    };
  }

  if (mode === "admin") {
    return {
      accountLinks: [],
      mode,
      primaryLinks: landingNavLinks,
      showAdmin: true,
      showLogin: false,
      showNotifications: false,
      showQuote: true,
      showUserMenu: true,
    };
  }

  return {
    accountLinks: customerHeaderNavigation,
    mode,
    primaryLinks: area === "public" ? landingNavLinks : customerAppNavigation,
    showAdmin: false,
    showLogin: false,
    showNotifications: false,
    showQuote: area === "public",
    showUserMenu: true,
  };
}

export function getCustomerInitials(identity: CustomerNavbarIdentity): string {
  const parts = identity.name.trim().split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    const first = parts[0];
    const last = parts[parts.length - 1];

    if (first !== undefined && last !== undefined) {
      return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
    }
  }

  if (parts[0] !== undefined && parts[0] !== "") {
    return parts[0].slice(0, 2).toUpperCase();
  }

  const emailPrefix = identity.email.trim().charAt(0);

  if (emailPrefix !== "") {
    return emailPrefix.toUpperCase();
  }

  return "N";
}

export function getAdminHomeHref(): string {
  return AUTH_ADMIN_HOME_PATH;
}

import { APP_NAME } from "@neatly/config";
import { AUTH_ADMIN_HOME_PATH } from "@/config/auth";

export const ADMIN_HOME_PATH = AUTH_ADMIN_HOME_PATH;
export const ADMIN_MAIN_CONTENT_ID = "admin-main-content";

export const adminShellCopy = {
  brandLabel: `${APP_NAME} Admin home`,
  brandName: APP_NAME,
  brandSuffix: "Admin",
  loadingLabel: "Loading",
  mainLabel: "Admin content",
  navigationLabel: "Admin navigation",
  skipToContent: "Skip to content",
} as const;

export const adminHomeCopy = {
  description:
    "Keep an eye on quotes, inquiries, and published content from one place.",
  heading: "Dashboard",
  title: "Dashboard",
} as const;

export const adminHeaderCopy = {
  accountMenuLabel: "Open account menu",
  breadcrumbLabel: "Breadcrumb",
  homeBreadcrumb: "Admin",
  homeTitle: "Dashboard",
  logoutItem: "Log out",
  notificationsLabel: "Notifications",
  openNavigationLabel: "Open navigation",
  profileItem: "Profile",
  profileLabel: "Admin",
  settingsItem: "Settings",
} as const;

export const adminSidebarCopy = {
  accountLabel: "Admin",
  collapseLabel: "Collapse sidebar",
  expandLabel: "Expand sidebar",
  closeNavigationLabel: "Close navigation",
  drawerDescription: "Navigate the admin application.",
  drawerTitle: "Admin navigation",
  logoutItem: "Log out",
  settingsItem: "Settings",
} as const;

export const adminErrorCopy = {
  action: "Try again",
  description: "An unexpected error occurred. You can try again.",
  heading: "Something went wrong",
} as const;

export const adminNotFoundCopy = {
  action: `Back to ${APP_NAME} Admin`,
  description: "The page you requested does not exist.",
  heading: "Page not found",
} as const;

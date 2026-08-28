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
    "Operations tools will appear here as they are built. This page confirms the application shell is ready.",
  heading: `Welcome to ${APP_NAME} Admin`,
  title: "Admin",
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

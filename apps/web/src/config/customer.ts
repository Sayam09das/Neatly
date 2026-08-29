import { APP_NAME } from "@neatly/config";
import { AUTH_ADMIN_LOGIN_PATH } from "@/config/auth";

export const CUSTOMER_HOME_PATH = "/dashboard";
export const CUSTOMER_LOGIN_PATH = AUTH_ADMIN_LOGIN_PATH;
export const CUSTOMER_MAIN_CONTENT_ID = "customer-main-content";

export const CUSTOMER_PATHS = {
  booking: "/booking",
  bookingConfirmation: "/booking/confirmation",
  bookings: "/dashboard/bookings",
  dashboard: CUSTOMER_HOME_PATH,
  help: "/dashboard/help",
  notifications: "/dashboard/notifications",
  profile: "/dashboard/profile",
  quote: "/quote",
  reviews: "/dashboard/reviews",
  services: "/services",
  settings: "/dashboard/settings",
} as const;

export const customerPaths = CUSTOMER_PATHS;

export const CUSTOMER_API_PREFIX = "/api/v1/customer";

export const CUSTOMER_API_PATHS = {
  booking: `${CUSTOMER_API_PREFIX}/bookings/:id`,
  bookings: `${CUSTOMER_API_PREFIX}/bookings`,
  notifications: `${CUSTOMER_API_PREFIX}/notifications`,
  profile: `${CUSTOMER_API_PREFIX}/me`,
  reviews: `${CUSTOMER_API_PREFIX}/reviews`,
  services: `${CUSTOMER_API_PREFIX}/services`,
} as const;

export const FORBIDDEN_CUSTOMER_AUTH_QUERY_KEYS = [
  "customerId",
  "userId",
] as const;

export const customerShellCopy = {
  brandLabel: `${APP_NAME} account home`,
  brandName: APP_NAME,
  loadingLabel: "Loading",
  logoutLabel: "Log out",
  mainLabel: "Account content",
  navigationLabel: "Account navigation",
  skipToContent: "Skip to content",
} as const;

export const customerErrorCopy = {
  action: "Try again",
  description: "An unexpected error occurred. You can try again.",
  heading: "Something went wrong",
} as const;

export const customerNotFoundCopy = {
  action: "Back to your account",
  description: "This page is not available.",
  heading: "Page not available",
} as const;

export const customerUnauthorizedCopy = {
  action: "Sign in",
  description: "Sign in to view your account.",
  heading: "Sign in required",
} as const;

export const customerForbiddenCopy = {
  action: "Back to your account",
  description: "You do not have access to this page.",
  heading: "Access unavailable",
} as const;

export const customerEmptyCopy = {
  bookings: {
    description: "When you book a cleaning, it will appear here.",
    title: "No bookings yet",
  },
  notifications: {
    description: "Updates about your bookings will appear here.",
    title: "No notifications yet",
  },
  reviews: {
    description:
      "Reviews you leave after a completed booking will appear here.",
    title: "No reviews yet",
  },
  services: {
    description: "Published cleaning services will appear here.",
    title: "No services listed",
  },
} as const;

export const customerSurfaceCopy = {
  booking: {
    description: "Choose a service and time when you are ready to book.",
    heading: "Book a cleaning",
    title: "Book a cleaning",
  },
  bookingConfirmation: {
    description: "A confirmation will appear here after a booking is created.",
    heading: "Booking confirmation",
    title: "Booking confirmation",
  },
  bookingDetail: {
    description: "Details for this booking will appear here when available.",
    heading: "Booking",
    title: "Booking",
  },
  bookings: {
    description: "Your upcoming and past bookings will appear here.",
    heading: "My bookings",
    title: "My bookings",
  },
  dashboard: {
    description:
      "Your bookings, updates, and account details will appear here.",
    heading: "Your account",
    title: "Your account",
  },
  help: {
    description: "Help for bookings and your account will appear here.",
    heading: "Help",
    title: "Help",
  },
  notifications: {
    description: "Updates about your bookings will appear here.",
    heading: "Notifications",
    title: "Notifications",
  },
  profile: {
    description: "Your contact details will appear here.",
    heading: "Profile",
    title: "Profile",
  },
  quote: {
    description:
      "Request a quote when you are ready. Nothing is submitted yet.",
    heading: "Request a quote",
    title: "Request a quote",
  },
  reviews: {
    description: "Reviews for completed bookings will appear here.",
    heading: "Reviews",
    title: "Reviews",
  },
  services: {
    description: "Published cleaning services will appear here.",
    heading: "Services",
    title: "Services",
  },
  serviceDetail: {
    description: "This service is not available.",
    heading: "Service",
    title: "Service",
  },
  settings: {
    description: "Account preferences will appear here.",
    heading: "Settings",
    title: "Settings",
  },
} as const;

export function customerServicePath(slug: string): string {
  return `${CUSTOMER_PATHS.services}/${encodeURIComponent(slug)}`;
}

export function customerBookingDetailPath(id: string): string {
  return `${CUSTOMER_PATHS.bookings}/${encodeURIComponent(id)}`;
}

export function withCustomerApiId(path: string, id: string): string {
  return path.replace(":id", encodeURIComponent(id));
}

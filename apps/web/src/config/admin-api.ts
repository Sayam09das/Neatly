export const ADMIN_API_PREFIX = "/api/v1/admin";
export const ADMIN_LIST_PAGE_SIZE = 20;
export const ADMIN_SEARCH_DEBOUNCE_MS = 300;
export const ADMIN_FILTER_CATALOG_LIMIT = 100;
export const ADMIN_SESSION_TOKEN_HEADER = "x-session-token";

export const ADMIN_API_PATHS = {
  bookings: `${ADMIN_API_PREFIX}/bookings`,
  booking: `${ADMIN_API_PREFIX}/bookings/:id`,
  bookingAssign: `${ADMIN_API_PREFIX}/bookings/:id/assign`,
  bookingStatus: `${ADMIN_API_PREFIX}/bookings/:id/status`,
  blog: `${ADMIN_API_PREFIX}/blog`,
  blogPost: `${ADMIN_API_PREFIX}/blog/:id`,
  cleaners: `${ADMIN_API_PREFIX}/cleaners`,
  cleaner: `${ADMIN_API_PREFIX}/cleaners/:id`,
  cleanerResendInvitation: `${ADMIN_API_PREFIX}/cleaners/:id/resend-invitation`,
  cleanerStatus: `${ADMIN_API_PREFIX}/cleaners/:id/status`,
  customers: `${ADMIN_API_PREFIX}/customers`,
  customer: `${ADMIN_API_PREFIX}/customers/:id`,
  customerStatus: `${ADMIN_API_PREFIX}/customers/:id/status`,
  dashboard: `${ADMIN_API_PREFIX}/dashboard`,
  me: `${ADMIN_API_PREFIX}/me`,
  media: `${ADMIN_API_PREFIX}/media`,
  newsletter: `${ADMIN_API_PREFIX}/newsletter`,
  newsletterSubscriber: `${ADMIN_API_PREFIX}/newsletter/:id`,
  notifications: `${ADMIN_API_PREFIX}/notifications`,
  notificationsReadAll: `${ADMIN_API_PREFIX}/notifications/read-all`,
  notificationRead: `${ADMIN_API_PREFIX}/notifications/:id/read`,
  notificationStream: `${ADMIN_API_PREFIX}/notifications/stream`,
  portfolio: `${ADMIN_API_PREFIX}/portfolio`,
  portfolioProject: `${ADMIN_API_PREFIX}/portfolio/:id`,
  quotes: `${ADMIN_API_PREFIX}/quotes`,
  quote: `${ADMIN_API_PREFIX}/quotes/:id`,
  reviews: `${ADMIN_API_PREFIX}/reviews`,
  review: `${ADMIN_API_PREFIX}/reviews/:id`,
  reviewHide: `${ADMIN_API_PREFIX}/reviews/:id/hide`,
  services: `${ADMIN_API_PREFIX}/services`,
  service: `${ADMIN_API_PREFIX}/services/:id`,
  serviceArchive: `${ADMIN_API_PREFIX}/services/:id/archive`,
  settings: `${ADMIN_API_PREFIX}/settings`,
} as const;

export function withAdminApiId(path: string, id: string): string {
  return path.replace(":id", encodeURIComponent(id));
}

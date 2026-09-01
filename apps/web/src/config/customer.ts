import { APP_NAME } from "@neatly/config";
import { AUTH_LOGIN_ALIAS_PATH } from "@/config/auth";

export const CUSTOMER_HOME_PATH = "/dashboard";
export const CUSTOMER_LOGIN_PATH = AUTH_LOGIN_ALIAS_PATH;
export const CUSTOMER_MAIN_CONTENT_ID = "customer-main-content";

export const CUSTOMER_PATHS = {
  booking: "/booking",
  bookingConfirmation: "/booking/confirmation",
  bookings: "/dashboard/bookings",
  dashboard: CUSTOMER_HOME_PATH,
  dashboardServices: "/dashboard/services",
  help: "/dashboard/help",
  notifications: "/dashboard/notifications",
  profile: "/dashboard/profile",
  quote: "/quote",
  quotes: "/dashboard/quotes",
  reviews: "/dashboard/reviews",
  services: "/services",
  settings: "/dashboard/settings",
} as const;

export const customerPaths = CUSTOMER_PATHS;

export const CUSTOMER_API_PREFIX = "/api/v1/customer";

export const CUSTOMER_API_PATHS = {
  account: `${CUSTOMER_API_PREFIX}/account`,
  accountLogoutAll: `${CUSTOMER_API_PREFIX}/account/logout-all`,
  accountPassword: `${CUSTOMER_API_PREFIX}/account/password`,
  accountSession: `${CUSTOMER_API_PREFIX}/account/sessions/:id`,
  accountVerifyEmail: `${CUSTOMER_API_PREFIX}/account/verify-email`,
  booking: `${CUSTOMER_API_PREFIX}/bookings/:id`,
  bookingCancel: `${CUSTOMER_API_PREFIX}/bookings/:id/cancel`,
  bookings: `${CUSTOMER_API_PREFIX}/bookings`,
  dashboard: `${CUSTOMER_API_PREFIX}/dashboard`,
  help: `${CUSTOMER_API_PREFIX}/help`,
  notification: `${CUSTOMER_API_PREFIX}/notifications/:id`,
  notificationRead: `${CUSTOMER_API_PREFIX}/notifications/:id/read`,
  notifications: `${CUSTOMER_API_PREFIX}/notifications`,
  notificationsReadAll: `${CUSTOMER_API_PREFIX}/notifications/read-all`,
  notificationsStream: `${CUSTOMER_API_PREFIX}/notifications/stream`,
  notificationsUnreadCount: `${CUSTOMER_API_PREFIX}/notifications/unread-count`,
  profile: `${CUSTOMER_API_PREFIX}/me`,
  quote: `${CUSTOMER_API_PREFIX}/quotes/:id`,
  quoteAccept: `${CUSTOMER_API_PREFIX}/quotes/:id/accept`,
  quoteDecline: `${CUSTOMER_API_PREFIX}/quotes/:id/decline`,
  quotes: `${CUSTOMER_API_PREFIX}/quotes`,
  review: `${CUSTOMER_API_PREFIX}/reviews/:id`,
  reviewDelete: `${CUSTOMER_API_PREFIX}/reviews/:id/delete`,
  reviews: `${CUSTOMER_API_PREFIX}/reviews`,
  service: `${CUSTOMER_API_PREFIX}/services/:slug`,
  services: `${CUSTOMER_API_PREFIX}/services`,
  blog: `${CUSTOMER_API_PREFIX}/blog`,
  blogPost: `${CUSTOMER_API_PREFIX}/blog/:slug`,
  newsletter: `${CUSTOMER_API_PREFIX}/newsletter`,
  testimonials: `${CUSTOMER_API_PREFIX}/testimonials`,
} as const;

export const CUSTOMER_BOOKINGS_SEARCH_PARAM = "q";
export const CUSTOMER_BOOKINGS_STATUS_PARAM = "status";
export const CUSTOMER_BOOKINGS_WINDOW_PARAM = "window";
export const CUSTOMER_BOOKINGS_PAGE_PARAM = "page";
export const CUSTOMER_BOOKINGS_SEARCH_INPUT_ID = "customer-bookings-search";
export const CUSTOMER_BOOKINGS_STATUS_INPUT_ID = "customer-bookings-status";
export const CUSTOMER_BOOKINGS_WINDOW_INPUT_ID = "customer-bookings-window";
export const CUSTOMER_BOOKING_REQUEST_TIMEOUT_MS = 8_000;
export const CUSTOMER_NOTIFICATIONS_PAGE_PARAM = "page";
export const CUSTOMER_NOTIFICATIONS_REQUEST_TIMEOUT_MS = 8_000;

export const CUSTOMER_SERVICES_SEARCH_PARAM = "q";
export const CUSTOMER_SERVICES_PAGE_PARAM = "page";
export const CUSTOMER_QUOTE_SERVICE_PARAM = "service";
export const CUSTOMER_BOOKING_QUOTE_PARAM = "quoteId";
export const CUSTOMER_SERVICES_SEARCH_MAX_LENGTH = 120;
export const CUSTOMER_SERVICES_SEARCH_INPUT_ID = "customer-services-search";
export const CUSTOMER_CATALOG_REQUEST_TIMEOUT_MS = 8_000;
export const CUSTOMER_TESTIMONIALS_REQUEST_TIMEOUT_MS = 8_000;
export const CUSTOMER_BLOG_REQUEST_TIMEOUT_MS = 8_000;
export const CUSTOMER_NEWSLETTER_REQUEST_TIMEOUT_MS = 8_000;

export const FORBIDDEN_CUSTOMER_AUTH_QUERY_KEYS = [
  "customerId",
  "userId",
] as const;

export const CUSTOMER_HEADER_HEIGHT_CLASS = "min-h-16";
export const CUSTOMER_MOBILE_NAV_ID = "customer-mobile-navigation";
export const CUSTOMER_SIDEBAR_EXPANDED_WIDTH = "16rem";
export const CUSTOMER_SIDEBAR_COLLAPSED_WIDTH = "4rem";
export const CUSTOMER_QUOTE_REQUEST_TIMEOUT_MS = 8_000;

export const customerShellCopy = {
  brandHomeLabel: `${APP_NAME} account home`,
  brandLabel: `${APP_NAME} home`,
  brandName: APP_NAME,
  loadingLabel: "Loading",
  logoutLabel: "Log out",
  mainLabel: "Account content",
  navigationLabel: "Account navigation",
  skipToContent: "Skip to content",
  workspaceLabel: "Customer",
} as const;

export const customerNavbarCopy = {
  accountMenuLabel: "Open account menu",
  adminLabel: "Admin",
  loginLabel: "Log in",
  menuCloseLabel: "Close menu",
  menuDescription: "Site and account navigation",
  menuOpenLabel: "Open menu",
  menuTitle: "Menu",
  notificationsLabel: "Notifications",
  primaryNavigationLabel: "Primary",
  roleLabel: "Customer",
} as const;

export const customerSidebarCopy = {
  collapseLabel: "Collapse sidebar",
  expandLabel: "Expand sidebar",
} as const;

export const customerErrorCopy = {
  action: "Try again",
  description: "An unexpected error occurred. You can try again.",
  heading: "Something went wrong",
} as const;

export const customerCatalogErrorCopy = {
  action: "Try Again",
  description: "Please try again in a moment.",
  heading: "We couldn't load our services right now.",
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
  quotes: {
    description: "Quote requests you submit will appear here.",
    title: "No quotes yet",
  },
  reviews: {
    description:
      "Reviews you leave after a completed booking will appear here.",
    title: "No reviews yet",
  },
  services: {
    description: `Check back soon to explore ${APP_NAME}'s cleaning services.`,
    title: "Services are being prepared.",
  },
  serviceSearch: {
    description: "Try a different search, or browse all published services.",
    title: "No services match your search.",
  },
} as const;

export const customerSurfaceCopy = {
  booking: {
    description:
      "Choose a published service and a preferred time. We will review the request before it is confirmed.",
    heading: "Book a cleaning",
    title: "Book a cleaning",
  },
  bookingConfirmation: {
    description: "Your booking details will appear here after you submit.",
    heading: "Booking received",
    title: "Booking received",
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
    description: "A concise view of your bookings and what needs attention.",
    heading: "Dashboard",
    title: "Dashboard",
  },
  help: {
    description: "Answers from published services and links for your account.",
    heading: "Help & Support",
    title: "Help & Support",
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
      "Share your property details so we can prepare a quote. This is a request, not a booking.",
    heading: "Request a quote",
    title: "Request a quote",
  },
  quotes: {
    description:
      "Quote requests you have submitted. This is not a booking list.",
    heading: "My Quotes",
    title: "My Quotes",
  },
  reviews: {
    description: "Reviews for completed bookings will appear here.",
    heading: "Reviews",
    title: "Reviews",
  },
  services: {
    description:
      "Choose the service that fits your home or workplace. Every service starts with a clear scope and a straightforward quote process.",
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

export const customerServicesCopy = {
  apply: "Request a Quote",
  backToServices: "Back to services",
  browseAll: "Browse all services",
  featuredLabel: "Featured",
  imageUnavailable: "No image available",
  paginationLabel: "Services pages",
  paginationNext: "Next",
  paginationPrevious: "Previous",
  requestQuote: "Request a Quote",
  searchClear: "Clear search",
  searchLabel: "Search services",
  searchPlaceholder: "Search by name or description",
  searchSubmit: "Search",
  viewDetails: "View Service",
} as const;

export const customerServiceDetailCopy = {
  benefitsHeading: "What you can expect",
  breadcrumbHome: "Home",
  breadcrumbLabel: "Service location",
  breadcrumbServices: "Services",
  changeService: "Choose a different service",
  descriptionHeading: "About this service",
  excludedHeading: "Not included",
  faqsHeading: "Questions",
  includedHeading: "What's included",
  nextStepsBody:
    "Request a quote with your property details. We will review the request and follow up — this does not create a booking.",
  nextStepsHeading: "What happens next",
  quoteCta: "Request a Quote",
} as const;

export const customerQuoteCopy = {
  accountEmailHint: "This is the email on your account.",
  addEmail: "Add another email",
  addPerson: "Add another person",
  addPhone: "Add another phone",
  changeService: "Change service",
  confirmationBody:
    "We received your request. A team member will review the details and follow up with a quote. This is not a booking.",
  confirmationHeading: "Quote request received",
  confirmationNext: "Browse services",
  continue: "Continue",
  edit: "Edit",
  honeypotLabel: "Company website",
  noServiceSelected: "No service selected yet. You can still request a quote.",
  removeExtra: "Remove",
  reviewHeading: "Review your request",
  selectedService: "Selected service",
  serverError: "We could not submit your request. Please try again.",
  stepContact: "Contact",
  stepDetails: "Details",
  stepProgress: "Quote request steps",
  stepProperty: "Property",
  stepReview: "Review",
  stepService: "Service",
  submit: "Submit request",
  submitting: "Submitting",
  unavailableService:
    "That service is no longer available. Choose another service to continue.",
} as const;

export const customerQuoteFieldCopy = {
  additionalNotes: "Additional notes",
  additionalNotesHint:
    "Optional. Access notes or priorities, up to 1,000 characters.",
  approximateSize: "Approximate size",
  bathrooms: "Bathrooms",
  bedrooms: "Bedrooms",
  email: "Email",
  extraEmail: "Additional email",
  extraPersonEmail: "Additional person email",
  extraPersonName: "Additional person name",
  extraPersonPhone: "Additional person phone",
  extraPhone: "Additional phone",
  frequency: "How often",
  fullName: "Full name",
  phone: "Phone",
  preferredDate: "Preferred date",
  preferredTime: "Preferred time of day",
  propertyType: "Property type",
  serviceAddress: "Service address",
  serviceType: "Service type",
} as const;

export const customerQuoteServiceTypeLabels = {
  COMMERCIAL: "Commercial",
  CUSTOM: "Custom",
  DEEP_CLEAN: "Deep clean",
  MOVE_IN_OUT: "Move-in / move-out",
  RESIDENTIAL: "Residential",
} as const;

export const customerQuotePropertyTypeLabels = {
  APARTMENT: "Apartment",
  COMMERCIAL_SPACE: "Commercial space",
  CONDO: "Condo",
  HOUSE: "House",
  OFFICE: "Office",
} as const;

export const customerQuoteFrequencyLabels = {
  BI_WEEKLY: "Bi-weekly",
  MONTHLY: "Monthly",
  ONE_TIME: "One-time",
  WEEKLY: "Weekly",
} as const;

export const customerQuoteStatusLabels = {
  ACCEPTED: "Accepted",
  CLOSED: "Closed",
  CONTACTED: "Contacted",
  CONVERTED: "Converted to booking",
  DECLINED: "Declined",
  NEW: "Waiting for quote",
  QUOTED: "Quoted",
  REVIEWING: "In review",
} as const;

export const customerQuotesCopy = {
  acceptAction: "Accept Quote",
  acceptError: "We could not accept this quote. Please try again.",
  acceptedHint: "Quote accepted",
  amountLabel: "Quoted amount",
  backToQuotes: "Back to quotes",
  bookAction: "Book Service",
  convertedHint: "Converted to booking",
  declineAction: "Decline quote",
  declineError: "We could not decline this quote. Please try again.",
  description: "Quote requests you have submitted. This is not a booking list.",
  detailsDescription: "Review the quote status and continue the booking flow.",
  detailsHeading: "Quote",
  detailsNotFound: "This quote is not available. Return to your quotes list.",
  heading: "My Quotes",
  loadError: "We could not load your quotes. Please try again.",
  preferredDate: "Preferred date",
  quotedHint: "Review the quoted amount, then accept to book.",
  referenceLabel: "Quote reference",
  requestAction: "Request a quote",
  serviceLabel: "Service",
  statusLabel: "Status",
  tableCaption: "Your quote requests",
  viewAction: "View quote",
  viewBookingAction: "View Booking",
  waitingHint: "Waiting for quote",
} as const;

export const QUOTE_APPROXIMATE_SIZES = [
  "Under 1,000 sq ft",
  "1,000-2,000 sq ft",
  "2,000-3,500 sq ft",
  "3,500+ sq ft",
] as const;

export const QUOTE_PREFERRED_TIMES = [
  "Morning (8am-12pm)",
  "Afternoon (12pm-4pm)",
  "Evening (4pm-8pm)",
] as const;

export const customerBookingCopy = {
  changeService: "Choose a different service",
  continue: "Continue",
  detailsHeading: "Booking details",
  edit: "Edit",
  noAvailabilityEngine:
    "Preferred time is a request. We do not reserve a slot until the booking is reviewed.",
  reviewHeading: "Review booking",
  scheduleHeading: "Preferred date and time",
  selectedService: "Service",
  serverError: "We could not create this booking. Please try again.",
  signInRequired: "Sign in to create a booking.",
  stepDetails: "Details",
  stepProgress: "Booking steps",
  stepReview: "Review",
  stepSchedule: "Schedule",
  stepService: "Service",
  submit: "Create booking",
  submitting: "Creating booking",
  quoteNotAccepted: "Accept a quoted request before creating a booking.",
  quoteRequired: "Book from an accepted quote. Open My Quotes to continue.",
  unavailableService:
    "That service is no longer available. Choose another published service.",
} as const;

export const customerBookingFieldCopy = {
  notes: "Special instructions",
  notesHint: "Optional. Access notes or priorities, up to 1,000 characters.",
  scheduledDate: "Preferred date",
  scheduledTime: "Preferred time",
  serviceAddress: "Service address",
} as const;

export const customerBookingConfirmationCopy = {
  copyReference: "Copy reference",
  copied: "Booking reference copied.",
  home: "Return home",
  linkedQuote: "This booking is linked to your quote request.",
  nextStepsBody:
    "We will review the booking and contact you if anything needs to change. Assignment details appear once a cleaner is assigned.",
  nextStepsHeading: "What happens next",
  pendingHeading: "Booking received",
  pendingBody:
    "Your booking is pending review. This is not a confirmed appointment until the status is updated.",
  confirmedHeading: "Your booking is confirmed",
  confirmedBody: "The scheduled visit is confirmed.",
  referenceLabel: "Booking reference",
  scheduleHeading: "Schedule",
  services: "Browse services",
  statusLabel: "Status",
  addressHeading: "Address",
  serviceHeading: "Service",
} as const;

export const customerDashboardCopy = {
  attentionBody:
    "These bookings are waiting for Neatly to review. Nothing is confirmed until the status changes.",
  attentionHeading: "Needs attention",
  attentionPending: "awaiting review",
  bookAction: "View bookings",
  emptyAction: "Explore Services",
  emptyDescription: "Explore our services and request your first quote.",
  emptyHeading: "Welcome to Neatly",
  emptyTitle: "Your cleaning journey starts here.",
  exploreServices: "Explore Services",
  greetingAfternoon: "Good afternoon, {name}",
  greetingEvening: "Good evening, {name}",
  greetingFallback: "Welcome back",
  greetingMorning: "Good morning, {name}",
  greetingNamed: "Welcome, {name}",
  helpAction: "Contact support",
  intro: "Here's what's happening with your cleaning services.",
  loadErrorAction: "Try again",
  loadErrorDescription: "Please try again.",
  loadErrorHeading: "We couldn't load your dashboard.",
  nextBookingEmptyAction: "Explore Services",
  nextBookingEmptyDescription:
    "When you book a cleaning service, your upcoming booking will appear here.",
  nextBookingEmptyTitle: "No upcoming bookings",
  nextBookingHeading: "Next booking",
  nextBookingHint: "Next: {when}",
  notificationsEmpty: "Updates about your bookings will appear here.",
  notificationsError: "Notifications could not be loaded.",
  notificationsHeading: "Recent notifications",
  notificationsUnreadHint: "Unread",
  notificationsViewAll: "View notifications",
  quotesEmpty: "Quote requests you submit will appear here.",
  quotesEmptyTitle: "No active quotes",
  quotesError: "Quotes could not be loaded.",
  quotesHeading: "Recent quotes",
  quotesPendingHint: "Awaiting response",
  quotesViewAll: "View all quotes",
  quickActionsHeading: "Quick actions",
  quoteAction: "View quotes",
  recentEmpty: "Recent bookings will appear here after you submit a request.",
  recentHeading: "Recent bookings",
  recentViewAll: "View all bookings",
  servicesAction: "Explore Services",
  servicesCtaAction: "Explore Services",
  servicesCtaBody: "Choose a service and request a quote in a few steps.",
  servicesCtaHeading: "Need a cleaning?",
  summaryCompleted: "Completed bookings",
  summaryCompletedHint: "Cleaning services",
  summaryHeading: "Overview",
  summaryNotifications: "Notifications",
  summaryPending: "Pending quotes",
  summaryTotal: "Total",
  summaryUpcoming: "Upcoming bookings",
  verificationAction: "Open settings",
  verificationBody:
    "Verify your email to keep your account secure and receive booking updates.",
  verificationHeading: "Email verification required",
  viewBooking: "View booking",
} as const;

export const customerBookingsCopy = {
  allStatuses: "All statuses",
  allWindows: "Any time",
  clearFilters: "Clear filters",
  description: "View the bookings linked to your account.",
  filterLabel: "Status",
  filteredEmptyDescription:
    "No bookings match these filters. Clear them to see your full list.",
  filteredEmptyTitle: "No bookings match your filters.",
  heading: "My bookings",
  loadError: "We could not load your bookings. Please try again.",
  paginationLabel: "Booking pages",
  paginationNext: "Next",
  paginationPrevious: "Previous",
  searchLabel: "Search bookings",
  searchPlaceholder: "Search by reference or service",
  tableCaption: "Your bookings",
  viewBooking: "View",
  windowLabel: "Schedule",
  windowPast: "Past",
  windowUpcoming: "Upcoming",
} as const;

export const customerBookingDetailCopy = {
  addressHeading: "Address",
  backToBookings: "Back to bookings",
  breadcrumbBookings: "My bookings",
  breadcrumbCurrent: "Booking",
  breadcrumbDashboard: "Overview",
  breadcrumbLabel: "Booking location",
  cancelAction: "Cancel booking",
  cancelConfirm: "Cancel booking",
  cancelDescription:
    "This booking will be cancelled. You can still see it in your booking history.",
  cancelKeep: "Keep booking",
  cancelTitle: "Cancel this booking?",
  cancelling: "Cancelling",
  cancelledSuccess: "Booking cancelled.",
  createdHeading: "Requested",
  heading: "Booking",
  leaveReview: "Leave a review",
  linkedQuote: "This booking is linked to a quote request.",
  manageHeading: "Manage booking",
  notesHeading: "Notes",
  referenceLabel: "Booking reference",
  resetAction: "Reset",
  saveAction: "Save changes",
  saving: "Saving",
  scheduleHeading: "Schedule",
  serviceHeading: "Service",
  statusLabel: "Status",
  unnamedService: "This booking does not include a service name.",
  updateDescription:
    "Preferred time is a request stored in UTC. We do not reserve a slot until the booking is reviewed.",
  updateHeading: "Update booking",
  updatedSuccess: "Booking updated.",
  viewReview: "View review",
} as const;

export const customerProfileCopy = {
  addressLabel: "Address",
  addressHint: "Optional home or mailing address.",
  description: "Update the contact details used for your bookings.",
  emailHint: "Email changes are managed in Settings.",
  emailLabel: "Email",
  heading: "Profile",
  nameLabel: "Name",
  phoneLabel: "Phone",
  resetAction: "Reset",
  saveAction: "Save changes",
  saving: "Saving",
  statusLabel: "Account status",
  success: "Profile updated successfully.",
} as const;

export const customerSettingsCopy = {
  accountHeading: "Account",
  currentPasswordLabel: "Current password",
  confirmPasswordLabel: "Confirm new password",
  description: "Manage sign-in and session security for this account.",
  emailLabel: "Email",
  emailReadOnly: "Email changes are not available from this account.",
  heading: "Settings",
  logoutAllAction: "Sign out of all devices",
  logoutAllBusy: "Signing out",
  logoutAllDescription:
    "This ends every signed-in session, including this one.",
  logoutAllSuccess: "Signed out of all devices.",
  logoutAllTitle: "Sign out of all devices?",
  newPasswordLabel: "New password",
  passwordHeading: "Password",
  passwordSave: "Update password",
  passwordSaving: "Updating",
  passwordSuccess: "Password updated successfully.",
  resendVerification: "Resend verification email",
  resending: "Sending",
  revokeAction: "Sign out",
  revokeBusy: "Signing out",
  revokeCurrent: "Current session",
  revokeOther: "Other session",
  sessionsEmpty: "No other sessions are signed in.",
  sessionsHeading: "Sessions",
  statusLabel: "Account status",
  verificationLabel: "Email verification",
  verificationSent:
    "If an account exists for this email, instructions have been sent.",
  verified: "Verified",
  unverified: "Not verified",
} as const;

export const customerHelpCopy = {
  allTopics: "All topics",
  clearSearch: "Clear search",
  contactEmpty:
    "Support requests cannot be submitted from this page yet. Use the account links above, or a published phone or email when it is available.",
  contactHeading: "Contact support",
  description:
    "Search published service questions or open the account page you need.",
  emptyFaqs:
    "Published service questions will appear here when they are available.",
  emptyFaqsTitle: "No help articles yet",
  heading: "Help",
  noResults: "No results found",
  noResultsAction: "Contact support",
  noResultsDescription:
    "Nothing matched that search. Try another phrase or contact support below.",
  resourcesHeading: "Your account",
  resultCount: "{count} results",
  searchLabel: "Search help",
  searchPlaceholder: "Search questions",
  topicsHeading: "Questions",
} as const;

export const customerHelpResources = [
  {
    description: "View, update, or cancel a booking you own.",
    href: CUSTOMER_PATHS.bookings,
    title: "Manage a booking",
  },
  {
    description: "Update the name, phone, or address on your account.",
    href: CUSTOMER_PATHS.profile,
    title: "Update your profile",
  },
  {
    description: "Change your password or review signed-in sessions.",
    href: CUSTOMER_PATHS.settings,
    title: "Account security",
  },
  {
    description: "Review a completed booking you own.",
    href: CUSTOMER_PATHS.reviews,
    title: "Reviews",
  },
  {
    description: "Request a quote for a published service.",
    href: CUSTOMER_PATHS.quote,
    title: "Request a quote",
  },
] as const;

export const customerNotificationsCopy = {
  description: "Updates about bookings you own will appear here.",
  emptyDescription: "Updates about your bookings will appear here.",
  emptyTitle: "No notifications yet",
  heading: "Notifications",
  markAllAction: "Mark all as read",
  markAllError: "Unable to mark notifications as read.",
  markAllSuccess: "All notifications marked as read.",
  markReadAction: "Mark as read",
  markReadError: "Unable to mark this notification as read.",
  markReadSuccess: "Notification marked as read.",
  marking: "Updating",
  paginationLabel: "Notification pages",
  paginationNext: "Next",
  paginationPrevious: "Previous",
  readLabel: "Read",
  unreadLabel: "Unread",
} as const;

export const customerReviewsCopy = {
  cancelEdit: "Cancel",
  commentLabel: "Your review",
  deleteAction: "Delete review",
  deleteConfirm: "Delete review",
  deleteDescription:
    "This removes the review from public view. You can write another review only if the booking becomes eligible again.",
  deleteKeep: "Keep review",
  deleteTitle: "Delete this review?",
  deleting: "Deleting",
  deletedSuccess: "Review deleted.",
  description: "Reviews for completed bookings you own.",
  editAction: "Edit review",
  eligibleEmpty: "Completed bookings you can review will appear here.",
  eligibleHeading: "Ready for review",
  emptyDescription:
    "When a booking is completed, you can leave a review from this page.",
  emptyTitle: "No reviews yet",
  heading: "Reviews",
  leaveAction: "Leave a review",
  ratingLabel: "Rating",
  ratingValue: "{rating} out of 5 stars selected.",
  saveAction: "Submit review",
  saving: "Submitting",
  submittedSuccess: "Review submitted successfully.",
  submittedListHeading: "Your reviews",
  updateAction: "Save review",
  updating: "Saving",
  updatedSuccess: "Review updated successfully.",
  viewBooking: "View booking",
} as const;

export const customerReviewStatusLabels = {
  pending: "Pending",
  published: "Published",
} as const;

export const customerBookingStatusLabels = {
  ASSIGNED: "Assigned",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
  CONFIRMED: "Confirmed",
  IN_PROGRESS: "In progress",
  PENDING: "Pending",
} as const;

export function customerServicePath(slug: string): string {
  return `${CUSTOMER_PATHS.services}/${encodeURIComponent(slug)}`;
}

export function customerServiceApplyPath(slug: string): string {
  return `${customerServicePath(slug)}/apply`;
}

export function customerDashboardServiceApplyPath(slug: string): string {
  return `${CUSTOMER_PATHS.dashboardServices}/${encodeURIComponent(slug)}/apply`;
}

export function customerQuoteDetailPath(id: string): string {
  return `${CUSTOMER_PATHS.quotes}/${encodeURIComponent(id)}`;
}

export function customerBookingFromQuotePath(
  quoteId: string,
  serviceSlug?: string,
): string {
  const params = new URLSearchParams();
  params.set(CUSTOMER_BOOKING_QUOTE_PARAM, quoteId);

  if (serviceSlug !== undefined && serviceSlug.trim() !== "") {
    params.set(CUSTOMER_QUOTE_SERVICE_PARAM, serviceSlug);
  }

  return `${CUSTOMER_PATHS.booking}?${params.toString()}`;
}

export function customerQuotePath(slug?: string): string {
  if (slug === undefined || slug.trim() === "") {
    return CUSTOMER_PATHS.quote;
  }

  const params = new URLSearchParams();
  params.set(CUSTOMER_QUOTE_SERVICE_PARAM, slug);
  return `${CUSTOMER_PATHS.quote}?${params.toString()}`;
}

export function customerBookingConfirmationPath(id: string): string {
  return `${CUSTOMER_PATHS.bookingConfirmation}/${encodeURIComponent(id)}`;
}

export function customerPublicServiceApiPath(slug: string): string {
  return `${CUSTOMER_API_PATHS.services}/${encodeURIComponent(slug)}`;
}

export function customerPublicBlogApiPath(slug: string): string {
  return `${CUSTOMER_API_PATHS.blog}/${encodeURIComponent(slug)}`;
}

export function customerQuoteLabel(name: string): string {
  return `Request a quote for ${name}`;
}

export function customerServiceApplyLabel(name: string): string {
  return customerQuoteLabel(name);
}

export function customerServiceDetailsLabel(name: string): string {
  return `View ${name}`;
}

export function customerBookingDetailPath(id: string): string {
  return `${CUSTOMER_PATHS.bookings}/${encodeURIComponent(id)}`;
}

export function withCustomerApiId(path: string, id: string): string {
  return path.replace(":id", encodeURIComponent(id));
}

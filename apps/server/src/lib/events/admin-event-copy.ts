export const ADMIN_APP_HREFS = {
  bookings: "/admin/bookings",
  cleaners: "/admin/cleaners",
  customers: "/admin/customers",
  notifications: "/admin/notifications",
  reviews: "/admin/reviews",
  services: "/admin/services",
} as const;

export const ADMIN_EVENT_COPY = {
  bookingAssigned: {
    message: "A booking was assigned to a cleaner.",
    relatedLabel: "View bookings",
    title: "Booking assigned",
  },
  bookingCancelled: {
    message: "A booking was cancelled.",
    relatedLabel: "View bookings",
    title: "Booking cancelled",
  },
  bookingCreated: {
    message: "A new booking requires attention.",
    relatedLabel: "View bookings",
    title: "New booking",
  },
  bookingStatusChanged: {
    message: "A booking status was updated.",
    relatedLabel: "View bookings",
    title: "Booking status changed",
  },
  cleanerCreated: {
    message: "A cleaner profile was added.",
    relatedLabel: "View bookings",
    title: "Cleaner added",
  },
  cleanerStatusChanged: {
    message: "A cleaner status was updated.",
    relatedLabel: "View bookings",
    title: "Cleaner status changed",
  },
  cleanerUpdated: {
    message: "A cleaner profile was updated.",
    relatedLabel: "View bookings",
    title: "Cleaner updated",
  },
  customerCreated: {
    message: "A new customer was added.",
    relatedLabel: "View customers",
    title: "New customer",
  },
  customerUpdated: {
    message: "A customer profile was updated.",
    relatedLabel: "View customers",
    title: "Customer updated",
  },
  notificationCreated: {
    message: "You have a new notification.",
    relatedLabel: "View notifications",
    title: "New notification",
  },
  reviewModerated: {
    message: "A review was moderated.",
    relatedLabel: "View reviews",
    title: "Review moderated",
  },
  serviceCreated: {
    message: "A new service was added.",
    relatedLabel: "View services",
    title: "New service",
  },
  serviceStatusChanged: {
    message: "A service was archived.",
    relatedLabel: "View services",
    title: "Service archived",
  },
  serviceUpdated: {
    message: "A service was updated.",
    relatedLabel: "View services",
    title: "Service updated",
  },
} as const;

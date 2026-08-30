export const CUSTOMER_APP_HREFS = {
  booking: (id: string): string => `/dashboard/bookings/${id}`,
  bookings: "/dashboard/bookings",
  quote: (id: string): string => `/dashboard/quotes/${id}`,
  quotes: "/dashboard/quotes",
  reviews: "/dashboard/reviews",
} as const;

export const CUSTOMER_EVENT_COPY = {
  bookingAssigned: {
    message: "A cleaner was assigned to your booking.",
    relatedLabel: "View booking",
    title: "Cleaner assigned",
  },
  bookingCancelled: {
    message: "Your booking was cancelled.",
    relatedLabel: "View booking",
    title: "Booking cancelled",
  },
  bookingCreated: {
    message: "Your booking request was received.",
    relatedLabel: "View booking",
    title: "Booking requested",
  },
  bookingUpdated: {
    message: "Your booking details were updated.",
    relatedLabel: "View booking",
    title: "Booking updated",
  },
  quoteReady: {
    message: "Your quote is ready to review.",
    relatedLabel: "View quote",
    title: "Quote ready",
  },
  reviewCreated: {
    message: "Your review was submitted and is awaiting publication.",
    relatedLabel: "View reviews",
    title: "Review submitted",
  },
} as const;

export type CustomerStatus = "ACTIVE" | "INACTIVE";

export type CustomerBookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type CustomerQuoteServiceType =
  | "RESIDENTIAL"
  | "DEEP_CLEAN"
  | "MOVE_IN_OUT"
  | "COMMERCIAL"
  | "CUSTOM";

export type CustomerQuotePropertyType =
  | "HOUSE"
  | "APARTMENT"
  | "CONDO"
  | "OFFICE"
  | "COMMERCIAL_SPACE";

export type CustomerQuoteFrequency =
  | "ONE_TIME"
  | "WEEKLY"
  | "BI_WEEKLY"
  | "MONTHLY";

export type CustomerServiceCategory =
  | "RESIDENTIAL"
  | "DEEP_CLEAN"
  | "MOVE_IN_OUT"
  | "COMMERCIAL";

export interface CustomerProfile {
  address: string | null;
  email: string;
  id: string;
  name: string;
  phone: string | null;
  status: CustomerStatus;
}

export interface CustomerBooking {
  cleanerId: string | null;
  customerId: string | null;
  id: string;
  notes: string | null;
  quoteRequestId: string | null;
  scheduledAt: string | null;
  serviceAddress: string | null;
  serviceId: string | null;
  status: CustomerBookingStatus;
}

export interface CustomerBookingActions {
  canCancel: boolean;
  canUpdate: boolean;
}

export interface CustomerBookingView {
  actions: CustomerBookingActions;
  id: string;
  linkedToQuote: boolean;
  notes: string | null;
  scheduledAt: string | null;
  service: { id: string; name: string } | null;
  serviceAddress: string | null;
  status: CustomerBookingStatus;
}

export interface CustomerBookingSummary {
  id: string;
  scheduledAt: string | null;
  serviceId: string | null;
  status: CustomerBookingStatus;
}

export interface CustomerBookingSummaryCounts {
  completed: number;
  pending: number;
  total: number;
  upcoming: number;
}

export interface CustomerOverview {
  recentBookings: CustomerBookingView[];
  summary: CustomerBookingSummaryCounts;
  upcomingBooking: CustomerBookingView | null;
}

export interface CustomerBookingPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface CustomerBookingList {
  items: CustomerBookingView[];
  pagination: CustomerBookingPagination;
}

export type CustomerBookingWindow = "upcoming" | "past";

export type CustomerQuoteStatus =
  | "NEW"
  | "REVIEWING"
  | "CONTACTED"
  | "QUOTED"
  | "CONVERTED"
  | "DECLINED"
  | "CLOSED";

export interface CustomerQuoteView {
  additionalNotes: string | null;
  approximateSize: string;
  bathrooms: number | null;
  bedrooms: number | null;
  createdAt: string;
  email: string;
  frequency: CustomerQuoteFrequency;
  fullName: string;
  id: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  propertyType: CustomerQuotePropertyType;
  serviceAddress: string;
  serviceId: string | null;
  serviceType: CustomerQuoteServiceType;
  status: CustomerQuoteStatus;
}

export interface CustomerQuotePagination {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

export interface CustomerQuoteList {
  items: CustomerQuoteView[];
  pagination: CustomerQuotePagination;
}

export interface CustomerNotification {
  createdAt: string;
  id: string;
  isRead: boolean;
  message: string;
  readAt: string | null;
  relatedHref: string | null;
  relatedLabel: string | null;
  title: string;
}

export interface CustomerNotificationPagination {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

export interface CustomerNotificationList {
  items: CustomerNotification[];
  pagination: CustomerNotificationPagination;
}

export type CustomerReviewStatus = "pending" | "published";

export interface CustomerReview {
  bookingId: string;
  content: string;
  createdAt: string;
  id: string;
  rating: number;
  serviceName: string | null;
  status: CustomerReviewStatus;
}

export interface CustomerEligibleBooking {
  id: string;
  scheduledAt: string | null;
  service: { id: string; name: string } | null;
  status: "COMPLETED";
}

export interface CustomerReviewWorkspace {
  eligibleBookings: CustomerEligibleBooking[];
  reviews: CustomerReview[];
}

export interface CustomerAccountSession {
  createdAt: string;
  current: boolean;
  expiresAt: string;
  id: string;
}

export interface CustomerAccount {
  email: string;
  emailVerified: boolean;
  sessions: CustomerAccountSession[];
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
}

export interface CustomerService {
  coverImageAlt: string | null;
  coverImageUrl: string | null;
  id: string;
  isFeatured: boolean;
  name: string;
  shortDescription: string;
  slug: string;
}

export interface CustomerServiceFaq {
  answer: string;
  question: string;
}

export interface CustomerServiceDetail extends CustomerService {
  benefits: string[];
  excludedTasks: string[];
  faqs: CustomerServiceFaq[];
  fullDescription: string;
  includedTasks: string[];
  seoDescription: string | null;
  seoTitle: string | null;
}

export interface CustomerServicePagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface CustomerHelpTopic {
  faqs: CustomerServiceFaq[];
  name: string;
  slug: string;
}

export interface CustomerHelpWorkspace {
  topics: CustomerHelpTopic[];
}

export interface CustomerPublishedContact {
  address: string | null;
  email: string | null;
  hours: string | null;
  phone: string | null;
}

export interface CustomerServiceList {
  pagination: CustomerServicePagination;
  services: CustomerService[];
}

export interface QuoteRequest {
  additionalNotes: string | null;
  approximateSize: string;
  bathrooms: number | null;
  bedrooms: number | null;
  email: string;
  frequency: CustomerQuoteFrequency;
  fullName: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  propertyType: CustomerQuotePropertyType;
  serviceAddress: string;
  serviceId: string | null;
  serviceType: CustomerQuoteServiceType;
}

export interface QuoteRequestConfirmation {
  frequency: CustomerQuoteFrequency;
  id: string;
  preferredDate: string;
  preferredTime: string;
  propertyType: CustomerQuotePropertyType;
  serviceId: string | null;
  serviceType: CustomerQuoteServiceType;
  status:
    | "NEW"
    | "REVIEWING"
    | "CONTACTED"
    | "QUOTED"
    | "CONVERTED"
    | "DECLINED"
    | "CLOSED";
}

export type CustomerUiStatus =
  | "loading"
  | "success"
  | "empty"
  | "error"
  | "unauthorized"
  | "not-found";

export type CustomerLoadingVariant = "page" | "section" | "list" | "detail";

export type CustomerPagePresentation<T> =
  | { status: "loading"; variant: CustomerLoadingVariant }
  | { status: "empty"; description: string; title: string }
  | { onRetry?: () => void; status: "error" }
  | { status: "unauthorized" }
  | { status: "not-found" }
  | { data: T; status: "success" };

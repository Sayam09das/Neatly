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

export interface CustomerBookingSummary {
  id: string;
  scheduledAt: string | null;
  serviceId: string | null;
  status: CustomerBookingStatus;
}

export interface CustomerNotification {
  createdAt: string | null;
  id: string;
  isRead: boolean;
  message: string;
  relatedHref: string | null;
  relatedLabel: string | null;
  title: string;
}

export interface CustomerReview {
  content: string;
  createdAt: string | null;
  id: string;
  rating: number;
  serviceCategory: CustomerServiceCategory | null;
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

export interface CustomerServicePagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
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

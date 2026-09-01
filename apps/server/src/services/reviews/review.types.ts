import type { ServiceCategory } from "@prisma/client";
import type { PaginationQuery, SortQuery } from "../../lib/query.ts";

export const REVIEW_SORT_FIELDS = ["createdAt", "rating", "sortOrder"] as const;

export const CUSTOMER_REVIEW_STATUSES = ["pending", "published"] as const;

export const PUBLIC_REVIEW_LIMIT = 6;
export const PUBLIC_REVIEW_FETCH_LIMIT = 20;

export type CustomerReviewStatus = (typeof CUSTOMER_REVIEW_STATUSES)[number];

export interface ReviewRecord {
  avatarMediaId: string | null;
  bookingId: string | null;
  content: string;
  createdAt: Date;
  customerId: string | null;
  customerName: string;
  customerRole: string | null;
  id: string;
  isActive: boolean;
  isFeatured: boolean;
  rating: number;
  serviceCategory: ServiceCategory | null;
  sortOrder: number;
  updatedAt: Date;
}

export interface CustomerReviewView {
  bookingId: string;
  content: string;
  createdAt: string;
  id: string;
  rating: number;
  serviceName: string | null;
  status: CustomerReviewStatus;
}

export interface CreateReviewInput {
  avatarMediaId?: string | null;
  bookingId?: string | null;
  content: string;
  customerId?: string | null;
  customerName: string;
  customerRole?: string | null;
  isActive?: boolean;
  isFeatured?: boolean;
  rating: number;
  serviceCategory?: ServiceCategory | null;
  sortOrder?: number;
}

export interface UpdateReviewInput {
  avatarMediaId?: string | null;
  content?: string;
  customerName?: string;
  customerRole?: string | null;
  isFeatured?: boolean;
  rating?: number;
  serviceCategory?: ServiceCategory | null;
  sortOrder?: number;
}

export interface ReviewListQuery {
  active?: boolean;
  bookingId?: string;
  category?: ServiceCategory;
  createdFrom?: Date;
  createdTo?: Date;
  customerId?: string;
  pagination?: PaginationQuery;
  rating?: number;
  search?: string;
  sort?: SortQuery;
}

export interface CustomerReviewWorkspace {
  eligibleBookings: readonly {
    id: string;
    scheduledAt: string | null;
    service: { id: string; name: string } | null;
    status: "COMPLETED";
  }[];
  reviews: readonly CustomerReviewView[];
}

export interface PublicReview {
  content: string;
  createdAt: string;
  customerName: string;
  customerRole: string | null;
  featured: boolean;
  id: string;
  rating: number;
  serviceCategory: ServiceCategory | null;
}

export interface PublicReviewList {
  items: PublicReview[];
}

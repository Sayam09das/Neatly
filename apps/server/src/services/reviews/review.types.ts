import type { ServiceCategory } from "@prisma/client";
import type { PaginationQuery, SortQuery } from "../../lib/query.ts";

export const REVIEW_SORT_FIELDS = ["createdAt", "rating", "sortOrder"] as const;

export interface ReviewRecord {
  avatarMediaId: string | null;
  content: string;
  createdAt: Date;
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

export interface CreateReviewInput {
  avatarMediaId?: string | null;
  content: string;
  customerName: string;
  customerRole?: string | null;
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
  category?: ServiceCategory;
  createdFrom?: Date;
  createdTo?: Date;
  pagination?: PaginationQuery;
  rating?: number;
  search?: string;
  sort?: SortQuery;
}

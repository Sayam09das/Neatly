import type {
  BlogStatus,
  NewsletterStatus,
  ServiceCategory,
} from "@prisma/client";
import type { PaginationQuery, SortQuery } from "../../lib/query.ts";

export const BLOG_SORT_FIELDS = ["createdAt", "publishedAt", "title"] as const;
export const PORTFOLIO_SORT_FIELDS = [
  "createdAt",
  "sortOrder",
  "title",
] as const;
export const NEWSLETTER_SORT_FIELDS = [
  "createdAt",
  "email",
  "subscribedAt",
] as const;

export interface BlogPostRecord {
  authorId: string;
  categoryId: string | null;
  categoryName: string | null;
  content: string;
  createdAt: Date;
  excerpt: string;
  id: string;
  publishedAt: Date | null;
  seoDescription: string | null;
  seoTitle: string | null;
  slug: string;
  status: BlogStatus;
  tags: string[];
  title: string;
  updatedAt: Date;
}

export interface PortfolioProjectRecord {
  category: ServiceCategory;
  createdAt: Date;
  description: string;
  id: string;
  isFeatured: boolean;
  isPublished: boolean;
  location: string | null;
  slug: string;
  sortOrder: number;
  title: string;
  updatedAt: Date;
}

export interface NewsletterSubscriberRecord {
  createdAt: Date;
  email: string;
  id: string;
  status: NewsletterStatus;
  subscribedAt: Date;
  unsubscribedAt: Date | null;
  updatedAt: Date;
}

export interface BlogListQuery {
  createdFrom?: Date;
  createdTo?: Date;
  pagination?: PaginationQuery;
  search?: string;
  sort?: SortQuery;
  status?: BlogStatus;
}

export interface PortfolioListQuery {
  category?: ServiceCategory;
  createdFrom?: Date;
  createdTo?: Date;
  pagination?: PaginationQuery;
  published?: boolean;
  search?: string;
  sort?: SortQuery;
}

export interface NewsletterListQuery {
  pagination?: PaginationQuery;
  search?: string;
  sort?: SortQuery;
  status?: NewsletterStatus;
  subscribedFrom?: Date;
  subscribedTo?: Date;
}

export interface PublicBlogPost {
  categoryName: string | null;
  coverImageAlt: string | null;
  coverImageUrl: string | null;
  excerpt: string;
  id: string;
  publishedAt: string;
  slug: string;
  title: string;
}

export interface PublicBlogPostDetail extends PublicBlogPost {
  content: string;
  seoDescription: string | null;
  seoTitle: string | null;
}

export interface PublicBlogListQuery {
  pagination?: PaginationQuery;
  search?: string;
}

export interface NewsletterSubscribeResult {
  subscribed: true;
}

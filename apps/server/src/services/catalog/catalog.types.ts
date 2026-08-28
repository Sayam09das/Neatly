import type { PaginationQuery, SortQuery } from "../../lib/query.ts";

export const CATALOG_SORT_FIELDS = ["createdAt", "name", "sortOrder"] as const;

export interface CatalogRecord {
  benefits: string[];
  coverMediaId: string | null;
  createdAt: Date;
  excludedTasks: string[];
  faqs: unknown;
  fullDescription: string;
  id: string;
  includedTasks: unknown;
  isActive: boolean;
  isFeatured: boolean;
  name: string;
  seoDescription: string | null;
  seoTitle: string | null;
  shortDescription: string;
  slug: string;
  sortOrder: number;
  updatedAt: Date;
}

export interface CreateCatalogInput {
  benefits?: string[];
  coverMediaId?: string | null;
  excludedTasks?: string[];
  faqs?: unknown;
  fullDescription: string;
  includedTasks?: unknown;
  isFeatured?: boolean;
  name: string;
  seoDescription?: string | null;
  seoTitle?: string | null;
  shortDescription: string;
  slug?: string;
  sortOrder?: number;
}

export interface UpdateCatalogInput {
  benefits?: string[];
  coverMediaId?: string | null;
  excludedTasks?: string[];
  faqs?: unknown;
  fullDescription?: string;
  includedTasks?: unknown;
  isFeatured?: boolean;
  name?: string;
  seoDescription?: string | null;
  seoTitle?: string | null;
  shortDescription?: string;
  slug?: string;
  sortOrder?: number;
}

export interface CatalogListQuery {
  active?: boolean;
  pagination?: PaginationQuery;
  search?: string;
  sort?: SortQuery;
}

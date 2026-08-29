import type { PaginationQuery, SortQuery } from "../../lib/query.ts";

export const CATALOG_SORT_FIELDS = ["createdAt", "name", "sortOrder"] as const;

export interface CatalogRecord {
  benefits: string[];
  coverImageAlt: string | null;
  coverImageUrl: string | null;
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

export interface PublicCatalogItem {
  coverImageAlt: string | null;
  coverImageUrl: string | null;
  id: string;
  isFeatured: boolean;
  name: string;
  shortDescription: string;
  slug: string;
}

export interface PublicCatalogListQuery {
  pagination?: PaginationQuery;
  search?: string;
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

export function catalogRecordMatchesSearch(
  record: Pick<CatalogRecord, "name" | "shortDescription">,
  search: string,
): boolean {
  const needle = search.trim().toLowerCase();

  if (needle === "") {
    return true;
  }

  return (
    record.name.toLowerCase().includes(needle) ||
    record.shortDescription.toLowerCase().includes(needle)
  );
}

export function toPublicCatalogItem(record: CatalogRecord): PublicCatalogItem {
  return {
    coverImageAlt: record.coverImageAlt,
    coverImageUrl: record.coverImageUrl,
    id: record.id,
    isFeatured: record.isFeatured,
    name: record.name,
    shortDescription: record.shortDescription,
    slug: record.slug,
  };
}

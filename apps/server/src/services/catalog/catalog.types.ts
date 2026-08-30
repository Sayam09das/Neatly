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

export interface PublicCatalogFaq {
  answer: string;
  question: string;
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

export interface PublicCatalogDetail extends PublicCatalogItem {
  benefits: string[];
  excludedTasks: string[];
  faqs: PublicCatalogFaq[];
  fullDescription: string;
  includedTasks: string[];
  seoDescription: string | null;
  seoTitle: string | null;
}

export interface PublicHelpTopic {
  faqs: PublicCatalogFaq[];
  name: string;
  slug: string;
}

export interface PublicCatalogListQuery {
  pagination?: PaginationQuery;
  search?: string;
}

export interface CreateCatalogInput {
  benefits?: string[];
  coverImageUrl?: string | null;
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
  coverImageUrl?: string | null;
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

export function toPublicCatalogDetail(
  record: CatalogRecord,
): PublicCatalogDetail {
  return {
    ...toPublicCatalogItem(record),
    benefits: sanitizeStringList(record.benefits),
    excludedTasks: sanitizeStringList(record.excludedTasks),
    faqs: toPublicCatalogFaqs(record.faqs),
    fullDescription: record.fullDescription,
    includedTasks: toPublicTaskList(record.includedTasks),
    seoDescription: emptyToNull(record.seoDescription),
    seoTitle: emptyToNull(record.seoTitle),
  };
}

export function toPublicTaskList(value: unknown): string[] {
  return sanitizeStringList(Array.isArray(value) ? value : []);
}

export function toPublicHelpTopic(
  record: CatalogRecord,
): PublicHelpTopic | null {
  const faqs = toPublicCatalogFaqs(record.faqs);

  if (faqs.length === 0) {
    return null;
  }

  return {
    faqs,
    name: record.name,
    slug: record.slug,
  };
}

export function toPublicCatalogFaqs(value: unknown): PublicCatalogFaq[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const faqs: PublicCatalogFaq[] = [];

  for (const item of value) {
    if (!isPlainRecord(item)) {
      continue;
    }

    const question = readTrimmedString(item.question);
    const answer = readTrimmedString(item.answer);

    if (question === null || answer === null) {
      continue;
    }

    faqs.push({ answer, question });
  }

  return faqs;
}

function sanitizeStringList(values: readonly unknown[]): string[] {
  const items: string[] = [];

  for (const value of values) {
    const text = readTrimmedString(value);

    if (text !== null) {
      items.push(text);
    }
  }

  return items;
}

function emptyToNull(value: string | null): string | null {
  if (value === null) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function readTrimmedString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

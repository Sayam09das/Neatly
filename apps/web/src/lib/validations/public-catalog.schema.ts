import { z } from "@neatly/config/zod";

export const publicCatalogItemSchema = z.object({
  coverImageAlt: z.string().nullable(),
  coverImageUrl: z.string().nullable(),
  id: z.string().min(1),
  isFeatured: z.boolean(),
  name: z.string().min(1),
  shortDescription: z.string(),
  slug: z.string().min(1),
});

export const publicCatalogFaqSchema = z.object({
  answer: z.string().min(1),
  question: z.string().min(1),
});

export const publicCatalogDetailSchema = publicCatalogItemSchema.extend({
  benefits: z.array(z.string()),
  excludedTasks: z.array(z.string()),
  faqs: z.array(publicCatalogFaqSchema),
  fullDescription: z.string(),
  includedTasks: z.array(z.string()),
  seoDescription: z.string().nullable(),
  seoTitle: z.string().nullable(),
});

export const publicCatalogDetailPayloadSchema = z.object({
  service: publicCatalogDetailSchema,
});

export const publicCatalogPaginationSchema = z.object({
  limit: z.number().int().positive(),
  page: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});

export const publicCatalogListSchema = z.object({
  items: z.array(z.unknown()),
  pagination: publicCatalogPaginationSchema,
});

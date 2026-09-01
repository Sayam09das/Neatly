import { z } from "@neatly/config/zod";

const PUBLIC_REVIEW_CONTENT_MAX = 8_000;
const PUBLIC_REVIEW_NAME_MAX = 200;
const PUBLIC_REVIEW_ROLE_MAX = 200;

export const PUBLIC_REVIEW_CATEGORIES = [
  "COMMERCIAL",
  "DEEP_CLEAN",
  "MOVE_IN_OUT",
  "RESIDENTIAL",
] as const;

export const publicReviewCategorySchema = z.enum(PUBLIC_REVIEW_CATEGORIES);

export const publicReviewSchema = z.object({
  content: z.string().trim().min(1).max(PUBLIC_REVIEW_CONTENT_MAX),
  createdAt: z.string().min(1),
  customerName: z.string().trim().min(1).max(PUBLIC_REVIEW_NAME_MAX),
  customerRole: z.string().trim().max(PUBLIC_REVIEW_ROLE_MAX).nullable(),
  featured: z.boolean(),
  id: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  serviceCategory: publicReviewCategorySchema.nullable(),
});

export const publicReviewListSchema = z.object({
  items: z.array(z.unknown()),
});

export type PublicReviewPayload = z.infer<typeof publicReviewSchema>;

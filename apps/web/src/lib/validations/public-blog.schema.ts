import { z } from "@neatly/config/zod";

const PUBLIC_BLOG_TEXT_MAX = 16_000;
const PUBLIC_BLOG_TITLE_MAX = 200;
const PUBLIC_BLOG_SLUG_MAX = 200;

export const publicBlogPostSchema = z.object({
  categoryName: z.string().trim().max(PUBLIC_BLOG_TITLE_MAX).nullable(),
  coverImageAlt: z.string().trim().max(PUBLIC_BLOG_TEXT_MAX).nullable(),
  coverImageUrl: z.string().trim().max(PUBLIC_BLOG_TEXT_MAX).nullable(),
  excerpt: z.string().trim().min(1).max(PUBLIC_BLOG_TEXT_MAX),
  id: z.string().min(1),
  publishedAt: z.string().min(1),
  slug: z.string().trim().min(1).max(PUBLIC_BLOG_SLUG_MAX),
  title: z.string().trim().min(1).max(PUBLIC_BLOG_TITLE_MAX),
});

export const publicBlogPostDetailSchema = publicBlogPostSchema.extend({
  content: z.string().trim().min(1).max(PUBLIC_BLOG_TEXT_MAX),
  seoDescription: z.string().trim().max(PUBLIC_BLOG_TEXT_MAX).nullable(),
  seoTitle: z.string().trim().max(PUBLIC_BLOG_TITLE_MAX).nullable(),
});

export const publicBlogListSchema = z.object({
  items: z.array(z.unknown()),
});

export const publicBlogDetailPayloadSchema = z.object({
  post: publicBlogPostDetailSchema,
});

export type PublicBlogPostPayload = z.infer<typeof publicBlogPostSchema>;
export type PublicBlogPostDetailPayload = z.infer<
  typeof publicBlogPostDetailSchema
>;

import { z } from "@neatly/config/zod";
import { ADMIN_TEXT_MAX_LENGTH } from "../../config/constants.ts";
import { optionalSearchSchema } from "./admin-query.ts";
import { limitSchema, pageSchema } from "./primitives.ts";

export const publicBlogListQuerySchema = z
  .object({
    limit: limitSchema,
    page: pageSchema,
    search: optionalSearchSchema,
  })
  .transform((value) => ({
    pagination: {
      limit: value.limit,
      page: value.page,
      skip: (value.page - 1) * value.limit,
    },
    search: value.search,
  }));

export type PublicBlogListQueryInput = z.infer<
  typeof publicBlogListQuerySchema
>;

export const publicBlogSlugParamSchema = z.strictObject({
  slug: z
    .string()
    .trim()
    .min(1, "Journal article was not found.")
    .max(ADMIN_TEXT_MAX_LENGTH, "Journal article was not found."),
});

export type PublicBlogSlugParam = z.infer<typeof publicBlogSlugParamSchema>;

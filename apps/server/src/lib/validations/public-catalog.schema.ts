import { z } from "@neatly/config/zod";
import { ADMIN_TEXT_MAX_LENGTH } from "../../config/constants.ts";
import { optionalSearchSchema } from "./admin-query.ts";
import { limitSchema, pageSchema } from "./primitives.ts";

export const publicCatalogListQuerySchema = z
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

export type PublicCatalogListQueryInput = z.infer<
  typeof publicCatalogListQuerySchema
>;

export const publicCatalogSlugParamSchema = z.strictObject({
  slug: z
    .string()
    .trim()
    .min(1, "Service offering was not found.")
    .max(ADMIN_TEXT_MAX_LENGTH, "Service offering was not found."),
});

export type PublicCatalogSlugParam = z.infer<
  typeof publicCatalogSlugParamSchema
>;

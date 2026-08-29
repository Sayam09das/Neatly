import { z } from "@neatly/config/zod";
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

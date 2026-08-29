import { z } from "@neatly/config/zod";
import { limitSchema, pageSchema, quoteStatusSchema } from "./primitives.ts";

export const customerQuoteListQuerySchema = z
  .object({
    limit: limitSchema,
    page: pageSchema,
    status: quoteStatusSchema.optional(),
  })
  .strict()
  .transform((value) => ({
    pagination: {
      limit: value.limit,
      page: value.page,
      skip: (value.page - 1) * value.limit,
    },
    status: value.status,
  }));

export type CustomerQuoteListQueryInput = z.infer<
  typeof customerQuoteListQuerySchema
>;

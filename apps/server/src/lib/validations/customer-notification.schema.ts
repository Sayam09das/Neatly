import { z } from "@neatly/config/zod";
import { booleanQuerySchema, limitSchema, pageSchema } from "./primitives.ts";

export const customerNotificationListQuerySchema = z
  .object({
    limit: limitSchema,
    page: pageSchema,
    unreadOnly: booleanQuerySchema.optional(),
  })
  .strict()
  .transform((value) => ({
    pagination: {
      limit: value.limit,
      page: value.page,
      skip: (value.page - 1) * value.limit,
    },
    unreadOnly: value.unreadOnly,
  }));

export type CustomerNotificationListQueryInput = z.infer<
  typeof customerNotificationListQuerySchema
>;

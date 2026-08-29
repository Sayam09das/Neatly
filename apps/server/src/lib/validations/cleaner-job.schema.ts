import { z } from "@neatly/config/zod";
import {
  CLEANER_JOB_WINDOWS,
  type CleanerJobListQuery,
} from "../../services/bookings/booking.types.ts";
import { dateQuerySchema, optionalSearchSchema } from "./admin-query.ts";
import { bookingStatusSchema, limitSchema, pageSchema } from "./primitives.ts";

export const cleanerJobListQuerySchema = z
  .object({
    limit: limitSchema,
    page: pageSchema,
    search: optionalSearchSchema,
    status: bookingStatusSchema.optional(),
    window: z.enum(CLEANER_JOB_WINDOWS).optional(),
  })
  .strict()
  .transform((value): CleanerJobListQuery => {
    return {
      pagination: {
        limit: value.limit,
        page: value.page,
        skip: (value.page - 1) * value.limit,
      },
      search: value.search,
      status: value.status,
      window: value.window,
    };
  });

export type CleanerJobListQueryInput = z.infer<
  typeof cleanerJobListQuerySchema
>;

export const cleanerScheduleQuerySchema = z
  .object({
    date: dateQuerySchema.optional(),
  })
  .strict()
  .transform((value): { date: Date } => {
    return {
      date: value.date ?? new Date(),
    };
  });

export type CleanerScheduleQueryInput = z.infer<
  typeof cleanerScheduleQuerySchema
>;

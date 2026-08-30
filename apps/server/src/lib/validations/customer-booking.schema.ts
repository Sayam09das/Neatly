import { z } from "@neatly/config/zod";
import {
  CUSTOMER_BOOKING_ADDRESS_MAX_LENGTH,
  CUSTOMER_BOOKING_ADDRESS_MIN_LENGTH,
  CUSTOMER_BOOKING_NOTES_MAX_LENGTH,
} from "../../config/bookings.ts";
import {
  CUSTOMER_BOOKING_WINDOWS,
  type CustomerBookingListQuery,
} from "../../services/bookings/booking.types.ts";
import { optionalSearchSchema } from "./admin-query.ts";
import {
  bookingStatusSchema,
  dateTimeSchema,
  idSchema,
  limitSchema,
  pageSchema,
} from "./primitives.ts";

export const createCustomerBookingBodySchema = z.strictObject({
  notes: z
    .string()
    .trim()
    .max(
      CUSTOMER_BOOKING_NOTES_MAX_LENGTH,
      "Keep notes under 1,000 characters.",
    )
    .optional()
    .nullable(),
  quoteRequestId: idSchema,
  scheduledAt: dateTimeSchema,
  serviceAddress: z
    .string()
    .trim()
    .min(CUSTOMER_BOOKING_ADDRESS_MIN_LENGTH, "Enter the service address.")
    .max(CUSTOMER_BOOKING_ADDRESS_MAX_LENGTH, "Use a shorter address."),
  serviceId: idSchema,
});

export type CreateCustomerBookingBody = z.infer<
  typeof createCustomerBookingBodySchema
>;

export const customerBookingListQuerySchema = z
  .object({
    limit: limitSchema,
    page: pageSchema,
    search: optionalSearchSchema,
    status: bookingStatusSchema.optional(),
    window: z.enum(CUSTOMER_BOOKING_WINDOWS).optional(),
  })
  .strict()
  .transform((value): CustomerBookingListQuery => {
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

export type CustomerBookingListQueryInput = z.infer<
  typeof customerBookingListQuerySchema
>;

export const updateCustomerBookingBodySchema = z
  .strictObject({
    notes: z
      .string()
      .trim()
      .max(
        CUSTOMER_BOOKING_NOTES_MAX_LENGTH,
        "Keep notes under 1,000 characters.",
      )
      .optional()
      .nullable(),
    scheduledAt: dateTimeSchema.optional(),
    serviceAddress: z
      .string()
      .trim()
      .min(CUSTOMER_BOOKING_ADDRESS_MIN_LENGTH, "Enter the service address.")
      .max(CUSTOMER_BOOKING_ADDRESS_MAX_LENGTH, "Use a shorter address.")
      .optional(),
  })
  .refine(
    (value) =>
      value.notes !== undefined ||
      value.scheduledAt !== undefined ||
      value.serviceAddress !== undefined,
    { message: "Provide at least one booking field to update." },
  );

export type UpdateCustomerBookingBody = z.infer<
  typeof updateCustomerBookingBodySchema
>;

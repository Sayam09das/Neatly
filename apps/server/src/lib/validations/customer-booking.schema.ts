import { z } from "@neatly/config/zod";
import {
  CUSTOMER_BOOKING_ADDRESS_MAX_LENGTH,
  CUSTOMER_BOOKING_ADDRESS_MIN_LENGTH,
  CUSTOMER_BOOKING_NOTES_MAX_LENGTH,
} from "../../config/bookings.ts";
import { dateTimeSchema, idSchema } from "./primitives.ts";

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
  quoteRequestId: idSchema.optional().nullable(),
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

import { z } from "@neatly/config/zod";
import { idSchema } from "./primitives.ts";

const reviewContentSchema = z
  .string()
  .trim()
  .min(12, "Write a little more about your experience.")
  .max(2_000, "Keep the review under 2,000 characters.");

const reviewRatingSchema = z
  .number({ error: "Enter a rating from 1 to 5." })
  .int({ error: "Enter a rating from 1 to 5." })
  .min(1, "Enter a rating from 1 to 5.")
  .max(5, "Enter a rating from 1 to 5.");

export const createCustomerReviewBodySchema = z.strictObject({
  bookingId: idSchema,
  content: reviewContentSchema,
  rating: reviewRatingSchema,
});

export type CreateCustomerReviewBody = z.infer<
  typeof createCustomerReviewBodySchema
>;

export const updateCustomerReviewBodySchema = z
  .strictObject({
    content: reviewContentSchema.optional(),
    rating: reviewRatingSchema.optional(),
  })
  .refine(
    (value) => value.content !== undefined || value.rating !== undefined,
    { message: "Provide a rating or comment to update." },
  );

export type UpdateCustomerReviewBody = z.infer<
  typeof updateCustomerReviewBodySchema
>;

export const customerReviewListQuerySchema = z.strictObject({});

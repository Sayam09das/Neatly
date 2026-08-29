import { z } from "@neatly/config/zod";

export const CUSTOMER_REVIEW_CONTENT_MIN = 12;
export const CUSTOMER_REVIEW_CONTENT_MAX = 2_000;
export const CUSTOMER_REVIEW_RATING_MIN = 1;
export const CUSTOMER_REVIEW_RATING_MAX = 5;

export const customerReviewFormSchema = z.object({
  content: z
    .string()
    .trim()
    .min(
      CUSTOMER_REVIEW_CONTENT_MIN,
      "Write a little more about your experience.",
    )
    .max(
      CUSTOMER_REVIEW_CONTENT_MAX,
      "Keep the review under 2,000 characters.",
    ),
  rating: z
    .number({ error: "Enter a rating from 1 to 5." })
    .int({ error: "Enter a rating from 1 to 5." })
    .min(CUSTOMER_REVIEW_RATING_MIN, "Enter a rating from 1 to 5.")
    .max(CUSTOMER_REVIEW_RATING_MAX, "Enter a rating from 1 to 5."),
});

export type CustomerReviewFormValues = z.infer<typeof customerReviewFormSchema>;

import { z } from "@neatly/config/zod";

export const publicNewsletterSchema = z.object({
  email: z.email("Enter a valid email."),
});

export type PublicNewsletterValues = z.infer<typeof publicNewsletterSchema>;

export const emptyPublicNewsletterValues = {
  email: "",
};

export const publicNewsletterSubscribeResultSchema = z.object({
  subscribed: z.literal(true),
});

import { z } from "@neatly/config/zod";
import { emailSchema } from "./primitives.ts";

export const subscribeNewsletterBodySchema = z.strictObject({
  email: emailSchema,
});

export type SubscribeNewsletterBody = z.infer<
  typeof subscribeNewsletterBodySchema
>;

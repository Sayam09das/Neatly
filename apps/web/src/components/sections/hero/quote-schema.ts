import { z } from "@neatly/config/zod";
import { heroQuoteForm } from "@/config/landing";

export const FULL_NAME_MIN_LENGTH = 2;
export const FULL_NAME_MAX_LENGTH = 80;
export const MESSAGE_MAX_LENGTH = 500;

export const heroQuoteServiceValues = [
  heroQuoteForm.services[0].value,
  heroQuoteForm.services[1].value,
  heroQuoteForm.services[2].value,
  heroQuoteForm.services[3].value,
  heroQuoteForm.services[4].value,
] as const;

export const heroQuoteSchema = z.object({
  email: z.email("Enter a valid email."),
  fullName: z
    .string()
    .trim()
    .min(FULL_NAME_MIN_LENGTH, "Enter your name.")
    .max(FULL_NAME_MAX_LENGTH, "Use a shorter name."),
  message: z
    .string()
    .trim()
    .max(MESSAGE_MAX_LENGTH, "Keep the note under 500 characters.")
    .transform((value) => (value === "" ? undefined : value)),
  service: z.enum(heroQuoteServiceValues, {
    error: "Choose a service.",
  }),
});

export type HeroQuoteValues = z.infer<typeof heroQuoteSchema>;

export const emptyHeroQuoteValues = {
  email: "",
  fullName: "",
  message: "",
  service: "",
};

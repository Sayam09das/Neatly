import { z } from "@neatly/config/zod";

export const CONTACT_FULL_NAME_MAX_LENGTH = 80;
export const CONTACT_FULL_NAME_MIN_LENGTH = 2;
export const CONTACT_MESSAGE_MAX_LENGTH = 2_000;
export const CONTACT_MESSAGE_MIN_LENGTH = 10;
export const CONTACT_PHONE_MAX_LENGTH = 30;
export const CONTACT_SUBJECT_MAX_LENGTH = 120;
export const CONTACT_SUBJECT_MIN_LENGTH = 3;

export const contactInquirySchema = z.object({
  email: z.email("Enter a valid email."),
  fullName: z
    .string()
    .trim()
    .min(CONTACT_FULL_NAME_MIN_LENGTH, "Enter your name.")
    .max(CONTACT_FULL_NAME_MAX_LENGTH, "Use a shorter name."),
  message: z
    .string()
    .trim()
    .min(CONTACT_MESSAGE_MIN_LENGTH, "Add a little more detail.")
    .max(
      CONTACT_MESSAGE_MAX_LENGTH,
      "Keep the message under 2,000 characters.",
    ),
  phone: z
    .string()
    .trim()
    .max(CONTACT_PHONE_MAX_LENGTH, "Use a shorter phone number.")
    .transform((value) => (value === "" ? undefined : value)),
  subject: z
    .string()
    .trim()
    .min(CONTACT_SUBJECT_MIN_LENGTH, "Enter a subject.")
    .max(CONTACT_SUBJECT_MAX_LENGTH, "Use a shorter subject."),
});

export type ContactInquiryValues = z.infer<typeof contactInquirySchema>;

export const emptyContactInquiryValues = {
  email: "",
  fullName: "",
  message: "",
  phone: "",
  subject: "",
};

import { z } from "@neatly/config/zod";
import {
  AUTH_PASSWORD_MAX_LENGTH,
  AUTH_PASSWORD_MIN_LENGTH,
} from "@/config/auth";

export const customerPasswordFormSchema = z
  .object({
    confirmPassword: z.string().min(1, "Confirm your new password."),
    currentPassword: z.string().min(1, "Enter your current password."),
    password: z
      .string()
      .min(
        AUTH_PASSWORD_MIN_LENGTH,
        `Use at least ${String(AUTH_PASSWORD_MIN_LENGTH)} characters.`,
      )
      .max(
        AUTH_PASSWORD_MAX_LENGTH,
        `Use at most ${String(AUTH_PASSWORD_MAX_LENGTH)} characters.`,
      ),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type CustomerPasswordFormValues = z.infer<
  typeof customerPasswordFormSchema
>;

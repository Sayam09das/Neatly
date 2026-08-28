import { z } from "@neatly/config/zod";
import {
  AUTH_NAME_MAX_LENGTH,
  AUTH_NAME_MIN_LENGTH,
} from "../../config/auth.ts";
import { emailSchema, passwordSchema } from "./primitives.ts";

const nameSchema = z
  .string()
  .trim()
  .min(AUTH_NAME_MIN_LENGTH, "Enter a name.")
  .max(AUTH_NAME_MAX_LENGTH, "Use a shorter name.");

const tokenSchema = z.string().trim().min(1, "A token is required.");

export const registerUserSchema = z.strictObject({
  email: emailSchema,
  name: nameSchema,
  password: passwordSchema,
});

export const loginSchema = z.strictObject({
  email: emailSchema,
  password: z.string().min(1, "Enter your password."),
});

export const forgotPasswordSchema = z.strictObject({
  email: emailSchema,
});

export const resetPasswordSchema = z.strictObject({
  password: passwordSchema,
  token: tokenSchema,
});

export const verifyEmailSchema = z.strictObject({
  token: tokenSchema,
});

export const resendVerificationSchema = z.strictObject({
  email: emailSchema,
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;

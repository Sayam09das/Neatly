import { z } from "@neatly/config/zod";
import {
  AUTH_NAME_MAX_LENGTH,
  AUTH_NAME_MIN_LENGTH,
  AUTH_PASSWORD_MAX_LENGTH,
  AUTH_PASSWORD_MIN_LENGTH,
} from "../../config/auth.ts";

const emailSchema = z.email("Enter a valid email.");

const passwordSchema = z
  .string()
  .min(
    AUTH_PASSWORD_MIN_LENGTH,
    `Use at least ${String(AUTH_PASSWORD_MIN_LENGTH)} characters.`,
  )
  .max(
    AUTH_PASSWORD_MAX_LENGTH,
    `Use at most ${String(AUTH_PASSWORD_MAX_LENGTH)} characters.`,
  );

const nameSchema = z
  .string()
  .trim()
  .min(AUTH_NAME_MIN_LENGTH, "Enter a name.")
  .max(AUTH_NAME_MAX_LENGTH, "Use a shorter name.");

const tokenSchema = z.string().trim().min(1, "A token is required.");

export const registerUserSchema = z.object({
  email: emailSchema,
  name: nameSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Enter your password."),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  password: passwordSchema,
  token: tokenSchema,
});

export const verifyEmailSchema = z.object({
  token: tokenSchema,
});

export const resendVerificationSchema = z.object({
  email: emailSchema,
});

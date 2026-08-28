import { z } from "@neatly/config/zod";
import { registerUserSchema } from "@/lib/validations/auth.schema";

export const registerFormSchema = registerUserSchema
  .extend({
    confirmPassword: z.string().min(1, "Confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerFormSchema>;

export const resetPasswordFormSchema = z
  .object({
    confirmPassword: z.string().min(1, "Confirm your password."),
    password: registerUserSchema.shape.password,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>;

export const emptyLoginFormValues = {
  email: "",
  password: "",
} as const;

export const emptyRegisterFormValues = {
  confirmPassword: "",
  email: "",
  name: "",
  password: "",
} as const;

export const emptyForgotPasswordFormValues = {
  email: "",
} as const;

export const emptyResetPasswordFormValues = {
  confirmPassword: "",
  password: "",
} as const;

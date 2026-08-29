import { z } from "@neatly/config/zod";
import {
  AUTH_NAME_MAX_LENGTH,
  AUTH_NAME_MIN_LENGTH,
} from "../../config/auth.ts";
import {
  QUOTE_PHONE_MAX_DIGITS,
  QUOTE_PHONE_MIN_DIGITS,
} from "../../config/quotes.ts";
import { passwordSchema } from "./primitives.ts";

const optionalPhoneSchema = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((value, ctx): string | null => {
    if (value === undefined || value === null || value === "") {
      return null;
    }

    const digits = value.replaceAll(/\D/g, "");

    if (
      digits.length < QUOTE_PHONE_MIN_DIGITS ||
      digits.length > QUOTE_PHONE_MAX_DIGITS
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Enter a valid phone number.",
      });
      return z.NEVER;
    }

    return value;
  });

export const updateCustomerProfileBodySchema = z
  .strictObject({
    address: z.string().trim().max(200).optional().nullable(),
    name: z
      .string()
      .trim()
      .min(AUTH_NAME_MIN_LENGTH, "Enter a name.")
      .max(AUTH_NAME_MAX_LENGTH, "Use a shorter name.")
      .optional(),
    phone: optionalPhoneSchema,
  })
  .refine(
    (value) =>
      value.address !== undefined ||
      value.name !== undefined ||
      value.phone !== undefined,
    { message: "Provide at least one profile field to update." },
  );

export type UpdateCustomerProfileBody = z.infer<
  typeof updateCustomerProfileBodySchema
>;

export const changeCustomerPasswordBodySchema = z.strictObject({
  currentPassword: z.string().min(1, "Enter your current password."),
  password: passwordSchema,
});

export type ChangeCustomerPasswordBody = z.infer<
  typeof changeCustomerPasswordBodySchema
>;

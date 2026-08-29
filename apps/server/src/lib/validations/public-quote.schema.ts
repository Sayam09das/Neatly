import { z } from "@neatly/config/zod";
import {
  QuoteFrequency,
  QuotePropertyType,
  QuoteServiceType,
} from "@prisma/client";
import {
  QUOTE_ADDRESS_MAX_LENGTH,
  QUOTE_ADDRESS_MIN_LENGTH,
  QUOTE_APPROXIMATE_SIZES,
  QUOTE_BATHROOMS_MAX,
  QUOTE_BATHROOMS_MIN,
  QUOTE_BEDROOMS_MAX,
  QUOTE_BEDROOMS_MIN,
  QUOTE_FULL_NAME_MAX_LENGTH,
  QUOTE_FULL_NAME_MIN_LENGTH,
  QUOTE_NOTES_MAX_LENGTH,
  QUOTE_PHONE_MAX_DIGITS,
  QUOTE_PHONE_MIN_DIGITS,
  QUOTE_PREFERRED_TIMES,
  QUOTE_RESIDENTIAL_PROPERTY_TYPES,
} from "../../config/quotes.ts";
import { dateQuerySchema } from "./admin-query.ts";
import { emailSchema, idSchema } from "./primitives.ts";

const residentialPropertyTypes = new Set<string>(
  QUOTE_RESIDENTIAL_PROPERTY_TYPES,
);

export const createPublicQuoteBodySchema = z
  .strictObject({
    additionalNotes: z
      .string()
      .trim()
      .max(QUOTE_NOTES_MAX_LENGTH, "Keep notes under 1,000 characters.")
      .optional()
      .nullable(),
    approximateSize: z.enum(QUOTE_APPROXIMATE_SIZES, {
      error: "Choose a property size.",
    }),
    bathrooms: z.coerce
      .number({ error: "Enter a valid bathroom count." })
      .min(QUOTE_BATHROOMS_MIN, "Enter a valid bathroom count.")
      .max(QUOTE_BATHROOMS_MAX, "Enter a valid bathroom count.")
      .multipleOf(0.5, { error: "Enter bathrooms in half-bath increments." })
      .optional()
      .nullable(),
    bedrooms: z.coerce
      .number({ error: "Enter a valid bedroom count." })
      .int({ error: "Enter a whole number of bedrooms." })
      .min(QUOTE_BEDROOMS_MIN, "Enter a valid bedroom count.")
      .max(QUOTE_BEDROOMS_MAX, "Enter a valid bedroom count.")
      .optional()
      .nullable(),
    companyWebsite: z.string().optional(),
    email: emailSchema,
    frequency: z.nativeEnum(QuoteFrequency, {
      error: "Choose how often you need cleaning.",
    }),
    fullName: z
      .string()
      .trim()
      .min(QUOTE_FULL_NAME_MIN_LENGTH, "Enter your name.")
      .max(QUOTE_FULL_NAME_MAX_LENGTH, "Use a shorter name."),
    phone: z
      .string()
      .trim()
      .min(1, "Enter a phone number.")
      .transform((value, ctx): string => {
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

        return value.trim();
      }),
    preferredDate: dateQuerySchema,
    preferredTime: z.enum(QUOTE_PREFERRED_TIMES, {
      error: "Choose a preferred time.",
    }),
    propertyType: z.nativeEnum(QuotePropertyType, {
      error: "Choose a property type.",
    }),
    serviceAddress: z
      .string()
      .trim()
      .min(QUOTE_ADDRESS_MIN_LENGTH, "Enter the service address.")
      .max(QUOTE_ADDRESS_MAX_LENGTH, "Use a shorter address."),
    serviceId: idSchema.optional().nullable(),
    serviceType: z.nativeEnum(QuoteServiceType, {
      error: "Choose a service type.",
    }),
  })
  .superRefine((value, ctx) => {
    if (
      value.companyWebsite !== undefined &&
      value.companyWebsite.trim() !== ""
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Unable to submit this request.",
        path: ["companyWebsite"],
      });
    }

    if (!residentialPropertyTypes.has(value.propertyType)) {
      return;
    }

    if (value.bedrooms === undefined || value.bedrooms === null) {
      ctx.addIssue({
        code: "custom",
        message: "Enter the number of bedrooms.",
        path: ["bedrooms"],
      });
    }

    if (value.bathrooms === undefined || value.bathrooms === null) {
      ctx.addIssue({
        code: "custom",
        message: "Enter the number of bathrooms.",
        path: ["bathrooms"],
      });
    }
  })
  .transform((value) => ({
    additionalNotes: value.additionalNotes ?? null,
    approximateSize: value.approximateSize,
    bathrooms: value.bathrooms ?? null,
    bedrooms: value.bedrooms ?? null,
    email: value.email,
    frequency: value.frequency,
    fullName: value.fullName,
    phone: value.phone,
    preferredDate: value.preferredDate,
    preferredTime: value.preferredTime,
    propertyType: value.propertyType,
    serviceAddress: value.serviceAddress,
    serviceId: value.serviceId ?? null,
    serviceType: value.serviceType,
  }));

export type CreatePublicQuoteBody = z.infer<typeof createPublicQuoteBodySchema>;

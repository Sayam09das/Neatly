import { z } from "@neatly/config/zod";
import {
  QUOTE_APPROXIMATE_SIZES,
  QUOTE_PREFERRED_TIMES,
} from "@/config/customer";

export const QUOTE_FULL_NAME_MIN_LENGTH = 2;
export const QUOTE_FULL_NAME_MAX_LENGTH = 80;
export const QUOTE_NOTES_MAX_LENGTH = 1_000;
export const QUOTE_ADDRESS_MIN_LENGTH = 3;
export const QUOTE_ADDRESS_MAX_LENGTH = 200;
export const QUOTE_PHONE_MIN_DIGITS = 10;
export const QUOTE_PHONE_MAX_DIGITS = 15;
export const QUOTE_BEDROOMS_MIN = 0;
export const QUOTE_BEDROOMS_MAX = 8;
export const QUOTE_BATHROOMS_MIN = 1;
export const QUOTE_BATHROOMS_MAX = 10;

export const quoteServiceTypes = [
  "RESIDENTIAL",
  "DEEP_CLEAN",
  "MOVE_IN_OUT",
  "COMMERCIAL",
  "CUSTOM",
] as const;

export const quotePropertyTypes = [
  "HOUSE",
  "APARTMENT",
  "CONDO",
  "OFFICE",
  "COMMERCIAL_SPACE",
] as const;

export const quoteFrequencies = [
  "ONE_TIME",
  "WEEKLY",
  "BI_WEEKLY",
  "MONTHLY",
] as const;

const residentialPropertyTypes = new Set(["HOUSE", "APARTMENT", "CONDO"]);

export const quoteRequestFormSchema = z
  .object({
    additionalNotes: z
      .string()
      .trim()
      .max(QUOTE_NOTES_MAX_LENGTH, "Keep notes under 1,000 characters."),
    approximateSize: z.enum(QUOTE_APPROXIMATE_SIZES, {
      error: "Choose a property size.",
    }),
    bathrooms: z.string(),
    bedrooms: z.string(),
    companyWebsite: z.string(),
    email: z.email("Enter a valid email."),
    frequency: z.enum(quoteFrequencies, {
      error: "Choose how often you need cleaning.",
    }),
    fullName: z
      .string()
      .trim()
      .min(QUOTE_FULL_NAME_MIN_LENGTH, "Enter your name.")
      .max(QUOTE_FULL_NAME_MAX_LENGTH, "Use a shorter name."),
    phone: z.string().trim().min(1, "Enter a phone number."),
    preferredDate: z.string().trim().min(1, "Choose a preferred date."),
    preferredTime: z.enum(QUOTE_PREFERRED_TIMES, {
      error: "Choose a preferred time.",
    }),
    propertyType: z.enum(quotePropertyTypes, {
      error: "Choose a property type.",
    }),
    serviceAddress: z
      .string()
      .trim()
      .min(QUOTE_ADDRESS_MIN_LENGTH, "Enter the service address.")
      .max(QUOTE_ADDRESS_MAX_LENGTH, "Use a shorter address."),
    serviceId: z.string(),
    serviceType: z.enum(quoteServiceTypes, {
      error: "Choose a service type.",
    }),
  })
  .superRefine((value, ctx) => {
    const digits = value.phone.replaceAll(/\D/g, "");

    if (
      digits.length < QUOTE_PHONE_MIN_DIGITS ||
      digits.length > QUOTE_PHONE_MAX_DIGITS
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Enter a valid phone number.",
        path: ["phone"],
      });
    }

    if (value.companyWebsite.trim() !== "") {
      ctx.addIssue({
        code: "custom",
        message: "Unable to submit this request.",
        path: ["companyWebsite"],
      });
    }

    if (!residentialPropertyTypes.has(value.propertyType)) {
      return;
    }

    const bedrooms = Number.parseInt(value.bedrooms, 10);
    if (
      !Number.isInteger(bedrooms) ||
      bedrooms < QUOTE_BEDROOMS_MIN ||
      bedrooms > QUOTE_BEDROOMS_MAX
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Enter the number of bedrooms.",
        path: ["bedrooms"],
      });
    }

    const bathrooms = Number.parseFloat(value.bathrooms);
    if (
      Number.isNaN(bathrooms) ||
      bathrooms < QUOTE_BATHROOMS_MIN ||
      bathrooms > QUOTE_BATHROOMS_MAX
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Enter the number of bathrooms.",
        path: ["bathrooms"],
      });
    }
  });

export type QuoteRequestFormValues = z.infer<typeof quoteRequestFormSchema>;

export const emptyQuoteRequestValues: QuoteRequestFormValues = {
  additionalNotes: "",
  approximateSize: QUOTE_APPROXIMATE_SIZES[0],
  bathrooms: "",
  bedrooms: "",
  companyWebsite: "",
  email: "",
  frequency: "ONE_TIME",
  fullName: "",
  phone: "",
  preferredDate: "",
  preferredTime: QUOTE_PREFERRED_TIMES[0],
  propertyType: "HOUSE",
  serviceAddress: "",
  serviceId: "",
  serviceType: "RESIDENTIAL",
};

export function toQuoteRequestPayload(
  values: QuoteRequestFormValues,
): Record<string, unknown> {
  const residential = residentialPropertyTypes.has(values.propertyType);

  return {
    additionalNotes:
      values.additionalNotes.trim() === ""
        ? null
        : values.additionalNotes.trim(),
    approximateSize: values.approximateSize,
    bathrooms: residential ? Number.parseFloat(values.bathrooms) : null,
    bedrooms: residential ? Number.parseInt(values.bedrooms, 10) : null,
    companyWebsite: values.companyWebsite,
    email: values.email.trim().toLowerCase(),
    frequency: values.frequency,
    fullName: values.fullName.trim(),
    phone: values.phone.trim(),
    preferredDate: values.preferredDate,
    preferredTime: values.preferredTime,
    propertyType: values.propertyType,
    serviceAddress: values.serviceAddress.trim(),
    serviceId: values.serviceId.trim() === "" ? null : values.serviceId.trim(),
    serviceType: values.serviceType,
  };
}

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
export const QUOTE_EXTRA_EMAIL_MAX = 1;
export const QUOTE_EXTRA_PHONE_MAX = 2;
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
    extraEmail: z.string(),
    extraPersonEmail: z.string(),
    extraPersonName: z.string(),
    extraPersonPhone: z.string(),
    extraPhone1: z.string(),
    extraPhone2: z.string(),
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
    addPhoneIssue(ctx, value.phone, ["phone"], true);
    addOptionalEmailIssue(ctx, value.extraEmail, ["extraEmail"]);
    addPhoneIssue(ctx, value.extraPhone1, ["extraPhone1"], false);
    addPhoneIssue(ctx, value.extraPhone2, ["extraPhone2"], false);
    addOptionalEmailIssue(ctx, value.extraPersonEmail, ["extraPersonEmail"]);
    addPhoneIssue(ctx, value.extraPersonPhone, ["extraPersonPhone"], false);

    const extraPersonStarted =
      value.extraPersonName.trim() !== "" ||
      value.extraPersonEmail.trim() !== "" ||
      value.extraPersonPhone.trim() !== "";

    if (extraPersonStarted) {
      const extraName = value.extraPersonName.trim();

      if (
        extraName.length < QUOTE_FULL_NAME_MIN_LENGTH ||
        extraName.length > QUOTE_FULL_NAME_MAX_LENGTH
      ) {
        ctx.addIssue({
          code: "custom",
          message: "Enter the additional person's name.",
          path: ["extraPersonName"],
        });
      }
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
  extraEmail: "",
  extraPersonEmail: "",
  extraPersonName: "",
  extraPersonPhone: "",
  extraPhone1: "",
  extraPhone2: "",
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

export interface QuoteAccountContact {
  address: string | null;
  email: string;
  name: string;
  phone: string | null;
}

export function quoteRequestValuesFromAccount(
  account: QuoteAccountContact | null,
  serviceId = "",
): QuoteRequestFormValues {
  return {
    ...emptyQuoteRequestValues,
    email: account?.email.trim() ?? "",
    fullName: account?.name.trim() ?? "",
    phone: account?.phone?.trim() ?? "",
    serviceAddress: account?.address?.trim() ?? "",
    serviceId,
  };
}

export function toQuoteRequestPayload(
  values: QuoteRequestFormValues,
): Record<string, unknown> {
  const residential = residentialPropertyTypes.has(values.propertyType);

  return {
    additionalNotes: mergeQuoteAdditionalNotes(values),
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

export function quoteExtraContactLines(
  values: QuoteRequestFormValues,
): readonly string[] {
  const lines: string[] = [];

  if (values.extraEmail.trim() !== "") {
    lines.push(`Additional email: ${values.extraEmail.trim().toLowerCase()}`);
  }

  if (values.extraPhone1.trim() !== "") {
    lines.push(`Additional phone: ${values.extraPhone1.trim()}`);
  }

  if (values.extraPhone2.trim() !== "") {
    lines.push(`Additional phone: ${values.extraPhone2.trim()}`);
  }

  const extraPerson = formatExtraPersonLine(values);

  if (extraPerson !== null) {
    lines.push(extraPerson);
  }

  return lines;
}

function mergeQuoteAdditionalNotes(
  values: QuoteRequestFormValues,
): string | null {
  const notes = values.additionalNotes.trim();
  const extras = quoteExtraContactLines(values);

  if (extras.length === 0) {
    return notes === "" ? null : notes;
  }

  const extraBlock = extras.join("\n");
  const combined = notes === "" ? extraBlock : `${notes}\n\n${extraBlock}`;

  return combined.slice(0, QUOTE_NOTES_MAX_LENGTH);
}

function formatExtraPersonLine(values: QuoteRequestFormValues): string | null {
  const name = values.extraPersonName.trim();
  const email = values.extraPersonEmail.trim().toLowerCase();
  const phone = values.extraPersonPhone.trim();

  if (name === "" && email === "" && phone === "") {
    return null;
  }

  return `Additional person: ${[name, email, phone].filter(Boolean).join(" · ")}`;
}

function addPhoneIssue(
  ctx: z.RefinementCtx,
  value: string,
  path: ReadonlyArray<PropertyKey>,
  required: boolean,
): void {
  const trimmed = value.trim();

  if (trimmed === "") {
    if (required) {
      ctx.addIssue({
        code: "custom",
        message: "Enter a valid phone number.",
        path: [...path],
      });
    }

    return;
  }

  const digits = trimmed.replaceAll(/\D/g, "");

  if (
    digits.length < QUOTE_PHONE_MIN_DIGITS ||
    digits.length > QUOTE_PHONE_MAX_DIGITS
  ) {
    ctx.addIssue({
      code: "custom",
      message: "Enter a valid phone number.",
      path: [...path],
    });
  }
}

function addOptionalEmailIssue(
  ctx: z.RefinementCtx,
  value: string,
  path: ReadonlyArray<PropertyKey>,
): void {
  const trimmed = value.trim();

  if (trimmed === "") {
    return;
  }

  if (!z.email().safeParse(trimmed).success) {
    ctx.addIssue({
      code: "custom",
      message: "Enter a valid email.",
      path: [...path],
    });
  }
}

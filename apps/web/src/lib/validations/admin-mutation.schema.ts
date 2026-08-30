import { z } from "@neatly/config/zod";

const SHORT_TEXT_MAX = 200;
const LONG_TEXT_MAX = 8_000;

const optionalText = z.string().trim().max(SHORT_TEXT_MAX);

export const createCustomerFormSchema = z.object({
  address: optionalText,
  email: z.email("Enter a valid email address."),
  name: z.string().trim().min(1, "Enter a name.").max(SHORT_TEXT_MAX),
  phone: optionalText,
});

export const updateCustomerFormSchema = createCustomerFormSchema;

export const createCleanerFormSchema = z.object({
  email: z.email("Enter a valid email address."),
  name: z.string().trim().min(1, "Enter a name.").max(SHORT_TEXT_MAX),
  phone: z.string().trim().min(1, "Enter a phone number.").max(SHORT_TEXT_MAX),
});

export const updateCleanerFormSchema = createCleanerFormSchema;

export const createServiceFormSchema = z.object({
  fullDescription: z
    .string()
    .trim()
    .min(1, "Enter a full description.")
    .max(LONG_TEXT_MAX),
  name: z.string().trim().min(1, "Enter a service name.").max(SHORT_TEXT_MAX),
  shortDescription: z
    .string()
    .trim()
    .min(1, "Enter a short description.")
    .max(SHORT_TEXT_MAX),
});

export const updateServiceFormSchema = createServiceFormSchema;

export const createBookingFormSchema = z.object({
  cleanerId: z.string(),
  customerId: z.string().min(1, "Select a customer."),
  notes: z.string().trim().max(LONG_TEXT_MAX),
  scheduledAt: z.string(),
  serviceAddress: optionalText,
  serviceId: z.string().min(1, "Select a service."),
});

export const updateBookingFormSchema = z.object({
  notes: z.string().trim().max(LONG_TEXT_MAX),
  scheduledAt: z.string(),
  serviceAddress: optionalText,
});

export const assignCleanerFormSchema = z.object({
  cleanerId: z.string().min(1, "Select a cleaner."),
});

export const changeBookingStatusFormSchema = z.object({
  status: z.string().min(1, "Select a status."),
});

export const updateSettingsEmailFormSchema = z.object({
  notificationEmail: z.email("Enter a valid email address."),
});

export const updateBusinessSettingsFormSchema = z.object({
  address: z.string().trim().min(1, "Enter an address.").max(SHORT_TEXT_MAX),
  email: z.email("Enter a valid email address."),
  name: z.string().trim().min(1, "Enter a business name.").max(SHORT_TEXT_MAX),
  phone: z.string().trim().min(1, "Enter a phone number.").max(SHORT_TEXT_MAX),
});

export type CreateCustomerFormValues = z.infer<typeof createCustomerFormSchema>;
export type CreateCleanerFormValues = z.infer<typeof createCleanerFormSchema>;
export type CreateServiceFormValues = z.infer<typeof createServiceFormSchema>;
export type CreateBookingFormValues = z.infer<typeof createBookingFormSchema>;
export type UpdateBookingFormValues = z.infer<typeof updateBookingFormSchema>;
export type UpdateBusinessSettingsFormValues = z.infer<
  typeof updateBusinessSettingsFormSchema
>;

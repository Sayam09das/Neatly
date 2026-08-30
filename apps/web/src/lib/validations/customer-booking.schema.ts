import { z } from "@neatly/config/zod";

export const BOOKING_NOTES_MAX_LENGTH = 1_000;
export const BOOKING_ADDRESS_MIN_LENGTH = 3;
export const BOOKING_ADDRESS_MAX_LENGTH = 200;

export const customerBookingFormSchema = z.object({
  notes: z
    .string()
    .trim()
    .max(BOOKING_NOTES_MAX_LENGTH, "Keep notes under 1,000 characters."),
  scheduledDate: z.string().trim().min(1, "Choose a preferred date."),
  scheduledTime: z.string().trim().min(1, "Choose a preferred time."),
  serviceAddress: z
    .string()
    .trim()
    .min(BOOKING_ADDRESS_MIN_LENGTH, "Enter the service address.")
    .max(BOOKING_ADDRESS_MAX_LENGTH, "Use a shorter address."),
  serviceId: z.string().min(1, "Choose a published service."),
  quoteRequestId: z.string().min(1, "Accept a quote before booking."),
});

export type CustomerBookingFormValues = z.infer<
  typeof customerBookingFormSchema
>;

export const emptyCustomerBookingValues: CustomerBookingFormValues = {
  notes: "",
  quoteRequestId: "",
  scheduledDate: "",
  scheduledTime: "",
  serviceAddress: "",
  serviceId: "",
};

export function toCustomerBookingPayload(
  values: CustomerBookingFormValues,
): Record<string, unknown> {
  return {
    notes: values.notes.trim() === "" ? null : values.notes.trim(),
    quoteRequestId: values.quoteRequestId,
    scheduledAt: `${values.scheduledDate}T${values.scheduledTime}:00.000Z`,
    serviceAddress: values.serviceAddress.trim(),
    serviceId: values.serviceId,
  };
}

export const customerBookingUpdateSchema = customerBookingFormSchema.omit({
  quoteRequestId: true,
  serviceId: true,
});

export type CustomerBookingUpdateValues = z.infer<
  typeof customerBookingUpdateSchema
>;

export function toCustomerBookingUpdatePayload(
  values: CustomerBookingUpdateValues,
): Record<string, unknown> {
  return {
    notes: values.notes.trim() === "" ? null : values.notes.trim(),
    scheduledAt: `${values.scheduledDate}T${values.scheduledTime}:00.000Z`,
    serviceAddress: values.serviceAddress.trim(),
  };
}

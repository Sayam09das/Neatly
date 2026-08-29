import { z } from "@neatly/config/zod";

export const CUSTOMER_PROFILE_NAME_MIN = 2;
export const CUSTOMER_PROFILE_NAME_MAX = 80;
export const CUSTOMER_PROFILE_PHONE_MIN_DIGITS = 10;
export const CUSTOMER_PROFILE_PHONE_MAX_DIGITS = 15;
export const CUSTOMER_PROFILE_ADDRESS_MAX = 200;

export const customerProfileFormSchema = z.object({
  address: z
    .string()
    .trim()
    .max(CUSTOMER_PROFILE_ADDRESS_MAX, "Use a shorter address."),
  name: z
    .string()
    .trim()
    .min(CUSTOMER_PROFILE_NAME_MIN, "Enter a name.")
    .max(CUSTOMER_PROFILE_NAME_MAX, "Use a shorter name."),
  phone: z
    .string()
    .trim()
    .refine((value): boolean => {
      if (value === "") {
        return true;
      }

      const digits = value.replaceAll(/\D/g, "");
      return (
        digits.length >= CUSTOMER_PROFILE_PHONE_MIN_DIGITS &&
        digits.length <= CUSTOMER_PROFILE_PHONE_MAX_DIGITS
      );
    }, "Enter a valid phone number."),
});

export type CustomerProfileFormValues = z.infer<
  typeof customerProfileFormSchema
>;

export function toCustomerProfilePayload(
  values: CustomerProfileFormValues,
): Record<string, unknown> {
  return {
    address: values.address.trim() === "" ? null : values.address.trim(),
    name: values.name.trim(),
    phone: values.phone.trim() === "" ? null : values.phone.trim(),
  };
}

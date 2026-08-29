import { z } from "@neatly/config/zod";
import { CUSTOMER_API_PATHS } from "@/config/customer";
import { customerRequest } from "@/lib/customer/request";
import type { QuoteRequestConfirmation } from "@/types/customer";

export const quoteRequestConfirmationSchema = z.object({
  frequency: z.enum(["ONE_TIME", "WEEKLY", "BI_WEEKLY", "MONTHLY"]),
  id: z.string().min(1),
  preferredDate: z.string().min(1),
  preferredTime: z.string().min(1),
  propertyType: z.enum([
    "HOUSE",
    "APARTMENT",
    "CONDO",
    "OFFICE",
    "COMMERCIAL_SPACE",
  ]),
  serviceId: z.string().nullable(),
  serviceType: z.enum([
    "RESIDENTIAL",
    "DEEP_CLEAN",
    "MOVE_IN_OUT",
    "COMMERCIAL",
    "CUSTOM",
  ]),
  status: z.enum([
    "NEW",
    "REVIEWING",
    "CONTACTED",
    "QUOTED",
    "CONVERTED",
    "DECLINED",
    "CLOSED",
  ]),
});

const quoteCreatePayloadSchema = z.object({
  quoteRequest: quoteRequestConfirmationSchema,
});

export async function submitQuoteRequest(
  payload: Record<string, unknown>,
): ReturnType<typeof customerRequest<QuoteRequestConfirmation>> {
  const result = await customerRequest<unknown>(CUSTOMER_API_PATHS.quotes, {
    body: JSON.stringify(payload),
    method: "POST",
  });

  if (!result.ok) {
    return result;
  }

  const parsed = quoteCreatePayloadSchema.safeParse(result.data);

  if (!parsed.success) {
    return {
      code: "INTERNAL_ERROR",
      fields: {},
      forbidden: false,
      message: "Unable to complete this request. Please try again.",
      ok: false,
      status: 0,
      unauthorized: false,
    };
  }

  return {
    data: parsed.data.quoteRequest,
    ok: true,
    status: result.status,
  };
}

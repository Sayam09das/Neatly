import { CUSTOMER_API_PATHS } from "@/config/customer";
import { landingNewsletter } from "@/config/landing";
import { customerRequest } from "@/lib/customer/request";
import {
  type PublicNewsletterValues,
  publicNewsletterSubscribeResultSchema,
} from "@/lib/validations/public-newsletter.schema";

export async function subscribePublicNewsletter(
  payload: PublicNewsletterValues,
): ReturnType<typeof customerRequest<{ subscribed: true }>> {
  const result = await customerRequest<unknown>(CUSTOMER_API_PATHS.newsletter, {
    body: JSON.stringify(payload),
    method: "POST",
  });

  if (!result.ok) {
    return result;
  }

  const parsed = publicNewsletterSubscribeResultSchema.safeParse(result.data);

  if (!parsed.success) {
    return {
      code: "INTERNAL_ERROR",
      fields: {},
      forbidden: false,
      message: landingNewsletter.errorMessage,
      ok: false,
      status: 0,
      unauthorized: false,
    };
  }

  return {
    data: parsed.data,
    ok: true,
    status: result.status,
  };
}

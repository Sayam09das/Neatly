import { jsonSuccess } from "@/lib/api/response";
import { AuthError } from "@/lib/auth/errors";
import { handleAuthRoute, readJsonBody } from "@/lib/auth/route";
import { getAuthService } from "@/lib/auth/runtime";
import { registerUserSchema } from "@/lib/validations/auth.schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  return handleAuthRoute(
    request,
    "customer-register",
    async (): Promise<Response> => {
      const body = await readJsonBody(request);
      const parsed = registerUserSchema.safeParse(body);

      if (!parsed.success) {
        throw new AuthError(
          "INVALID_INPUT",
          "Check your details and try again.",
        );
      }

      const user = await getAuthService().registerCustomer(parsed.data);

      return jsonSuccess({ user }, { status: 201 });
    },
  );
}

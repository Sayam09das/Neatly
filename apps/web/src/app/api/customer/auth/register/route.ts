import { cookies } from "next/headers";
import { jsonSuccess } from "@/lib/api/response";
import { createSessionCookie } from "@/lib/auth/cookies";
import { AuthError } from "@/lib/auth/errors";
import { getRequestIp } from "@/lib/auth/request";
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

      const auth = getAuthService();
      await auth.registerCustomer(parsed.data);
      const result = await auth.authenticateUser(
        {
          email: parsed.data.email,
          password: parsed.data.password,
        },
        {
          ip: getRequestIp(request),
        },
      );
      const jar = await cookies();
      jar.set(createSessionCookie(result.sessionToken));

      return jsonSuccess({
        expiresAt: result.expiresAt.toISOString(),
        user: result.user,
      });
    },
  );
}

import { cookies } from "next/headers";
import { jsonSuccess } from "@/lib/api/response";
import { createSessionCookie } from "@/lib/auth/cookies";
import { getRequestIp } from "@/lib/auth/request";
import { handleAuthRoute, readJsonBody } from "@/lib/auth/route";
import { getAuthService } from "@/lib/auth/runtime";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  return handleAuthRoute(
    request,
    "customer-register",
    async (): Promise<Response> => {
      const body = await readJsonBody(request);
      const auth = getAuthService();
      await auth.registerCustomer(body);
      const result = await auth.authenticateUser(body, {
        ip: getRequestIp(request),
      });
      const jar = await cookies();
      jar.set(createSessionCookie(result.sessionToken));

      return jsonSuccess({
        expiresAt: result.expiresAt.toISOString(),
        user: result.user,
      });
    },
  );
}

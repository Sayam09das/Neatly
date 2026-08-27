import { cookies } from "next/headers";
import { jsonSuccess } from "@/lib/api/response";
import { createSessionCookie } from "@/lib/auth/cookies";
import { getRequestIp } from "@/lib/auth/request";
import { handleAuthRoute, readJsonBody } from "@/lib/auth/route";
import { getAuthService } from "@/lib/auth/runtime";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  return handleAuthRoute(request, "login", async (): Promise<Response> => {
    const body = await readJsonBody(request);
    const result = await getAuthService().authenticateUser(body, {
      ip: getRequestIp(request),
    });
    const jar = await cookies();
    const cookie = createSessionCookie(result.sessionToken);
    jar.set(cookie);

    return jsonSuccess({
      user: result.user,
      expiresAt: result.expiresAt.toISOString(),
    });
  });
}

import { cookies } from "next/headers";
import { AUTH_SESSION_COOKIE_NAME } from "@/config/auth";
import { jsonSuccess } from "@/lib/api/response";
import { createClearedSessionCookie } from "@/lib/auth/cookies";
import { handleAuthRoute } from "@/lib/auth/route";
import { getAuthService } from "@/lib/auth/runtime";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  return handleAuthRoute(request, "logout", async (): Promise<Response> => {
    const jar = await cookies();
    const sessionToken = jar.get(AUTH_SESSION_COOKIE_NAME)?.value;
    await getAuthService().logout(sessionToken);
    jar.set(createClearedSessionCookie());

    return jsonSuccess({ signedOut: true });
  });
}

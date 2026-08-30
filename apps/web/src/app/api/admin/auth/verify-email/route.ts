import { jsonSuccess } from "@/lib/api/response";
import { getRequestIp } from "@/lib/auth/request";
import { handleAuthRoute, readJsonBody } from "@/lib/auth/route";
import { getAuthService } from "@/lib/auth/runtime";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  return handleAuthRoute(
    request,
    "verify_email",
    async (): Promise<Response> => {
      const body = await readJsonBody(request);
      const user = await getAuthService().verifyEmail(body, {
        ip: getRequestIp(request),
      });
      return jsonSuccess({
        user: {
          email: user.email,
          id: user.id,
        },
      });
    },
  );
}

import { jsonSuccess } from "@/lib/api/response";
import { getRequestIp } from "@/lib/auth/request";
import { handleAuthRoute, readJsonBody } from "@/lib/auth/route";
import { getAuthService } from "@/lib/auth/runtime";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  return handleAuthRoute(
    request,
    "resend_verification",
    async (): Promise<Response> => {
      const body = await readJsonBody(request);
      const result = await getAuthService().requestEmailVerification(body, {
        ip: getRequestIp(request),
      });
      return jsonSuccess(result);
    },
  );
}

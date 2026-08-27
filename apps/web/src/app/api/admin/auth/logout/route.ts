import { jsonSuccess } from "@/lib/api/response";
import { logoutCurrentSession } from "@/lib/auth/current-user";
import { handleAuthRoute } from "@/lib/auth/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  return handleAuthRoute(request, "logout", async (): Promise<Response> => {
    await logoutCurrentSession();
    return jsonSuccess({ signedOut: true });
  });
}

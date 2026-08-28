import { jsonSuccess } from "@/lib/api/response";
import { handleAuthRoute, readJsonBody } from "@/lib/auth/route";
import { getAuthService } from "@/lib/auth/runtime";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  return handleAuthRoute(request, "register", async (): Promise<Response> => {
    const body = await readJsonBody(request);
    const user = await getAuthService().registerUser(body);
    return jsonSuccess({ user });
  });
}

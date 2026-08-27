import { jsonError } from "@/lib/api/response";
import { assertSameOrigin } from "@/lib/auth/csrf";
import { AUTH_ERROR_MESSAGES, AuthError } from "@/lib/auth/errors";
import { logAuthEvent } from "@/lib/auth/logger";
import { getRequestId } from "@/lib/auth/request";

export async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new AuthError("INVALID_INPUT", "Validation failed.", [
      { field: "body", issue: "Request body must be valid JSON." },
    ]);
  }
}

export async function handleAuthRoute(
  request: Request,
  type: string,
  action: (requestId: string) => Promise<Response>,
): Promise<Response> {
  const requestId = getRequestId(request);

  try {
    assertSameOrigin(request);
    const response = await action(requestId);
    logAuthEvent({
      type,
      outcome: "success",
      requestId,
    });
    return response;
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      logAuthEvent({
        type,
        outcome: "failure",
        requestId,
        code: error.code,
      });
      return jsonError(error);
    }

    logAuthEvent({
      type: `${type}_internal_error`,
      outcome: "failure",
      requestId,
      code: "INTERNAL_ERROR",
    });

    return jsonError(
      new AuthError("INTERNAL_ERROR", AUTH_ERROR_MESSAGES.INTERNAL_ERROR),
    );
  }
}

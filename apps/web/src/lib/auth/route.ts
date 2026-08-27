import { jsonError } from "@/lib/api/response";
import { assertSameOrigin } from "@/lib/auth/csrf";
import { requireAuth } from "@/lib/auth/current-user";
import { AUTH_ERROR_MESSAGES, AuthError } from "@/lib/auth/errors";
import { logAuthEvent } from "@/lib/auth/logger";
import { getRequestId } from "@/lib/auth/request";
import type { AuthUser } from "@/types/auth";

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

export async function handleProtectedAdminRoute(
  request: Request,
  type: string,
  action: (context: { user: AuthUser; requestId: string }) => Promise<Response>,
): Promise<Response> {
  const requestId = getRequestId(request);

  try {
    if (request.method !== "GET" && request.method !== "HEAD") {
      assertSameOrigin(request);
    }

    const user = await requireAuth();
    const response = await action({ user, requestId });
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

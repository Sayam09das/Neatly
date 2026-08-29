import { loadServerEnv } from "@neatly/config/server";
import { cookies } from "next/headers";
import { ADMIN_SESSION_TOKEN_HEADER } from "@/config/admin-api";
import { AUTH_SESSION_COOKIE_NAME } from "@/config/auth";
import { jsonError } from "@/lib/api/response";
import { assertSameOrigin } from "@/lib/auth/csrf";
import { AUTH_ERROR_MESSAGES, AuthError } from "@/lib/auth/errors";
import { getRequestId, getRequestIp } from "@/lib/auth/request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface CustomerProxyContext {
  params: Promise<{ path: string[] }>;
}

export async function GET(
  request: Request,
  context: CustomerProxyContext,
): Promise<Response> {
  return proxyCustomerRequest(request, context, "GET");
}

export async function POST(
  request: Request,
  context: CustomerProxyContext,
): Promise<Response> {
  return proxyCustomerRequest(request, context, "POST");
}

async function proxyCustomerRequest(
  request: Request,
  context: CustomerProxyContext,
  method: "GET" | "POST",
): Promise<Response> {
  const requestId = getRequestId(request);

  try {
    assertSameOrigin(request);

    const { path } = await context.params;
    const segments = path.filter((segment) => segment !== "");

    if (segments.length === 0) {
      throw new AuthError("INVALID_INPUT", AUTH_ERROR_MESSAGES.INTERNAL_ERROR);
    }

    if (segments.includes("admin")) {
      throw new AuthError("FORBIDDEN", AUTH_ERROR_MESSAGES.FORBIDDEN);
    }

    const env = loadServerEnv();
    const origin = env.NEATLY_API_URL.endsWith("/")
      ? env.NEATLY_API_URL.slice(0, -1)
      : env.NEATLY_API_URL;
    const search = new URL(request.url).search;
    const target = `${origin}/api/v1/customer/${segments.join("/")}${search}`;
    const jar = await cookies();
    const sessionToken = jar.get(AUTH_SESSION_COOKIE_NAME)?.value;
    const headers = new Headers();

    headers.set("accept", "application/json");
    headers.set("x-forwarded-for", getRequestIp(request));
    headers.set("x-request-id", requestId);

    if (sessionToken !== undefined && sessionToken.trim() !== "") {
      headers.set(ADMIN_SESSION_TOKEN_HEADER, sessionToken);
    }

    const contentType = request.headers.get("content-type");

    if (contentType !== null && contentType.trim() !== "") {
      headers.set("content-type", contentType);
    }

    const body = method === "GET" ? undefined : await request.arrayBuffer();

    const upstream = await fetch(target, {
      body,
      cache: "no-store",
      headers,
      method,
    });

    const upstreamContentType =
      upstream.headers.get("content-type") ?? "application/json; charset=utf-8";
    const responseBody = await upstream.text();

    return new Response(responseBody, {
      headers: {
        "cache-control": "no-store",
        "content-type": upstreamContentType,
      },
      status: upstream.status,
    });
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return jsonError(error, {
        headers: { "x-request-id": requestId },
      });
    }

    return jsonError(
      new AuthError("INTERNAL_ERROR", AUTH_ERROR_MESSAGES.INTERNAL_ERROR),
      { headers: { "x-request-id": requestId } },
    );
  }
}

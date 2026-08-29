import { AUTH_ADMIN_HOME_PATH } from "@/config/auth";
import type { LoginValues } from "@/lib/validations/auth.schema";
import type {
  AuthFormBannerCode,
  AuthFormSubmitResult,
} from "@/types/auth-form";

const LOGIN_ERROR_CODES = new Set<AuthFormBannerCode>([
  "INVALID_CREDENTIALS",
  "NETWORK_ERROR",
  "RATE_LIMITED",
  "UNEXPECTED_ERROR",
]);

export async function submitAdminLogin(
  values: LoginValues,
): Promise<AuthFormSubmitResult> {
  try {
    const response = await fetch("/api/admin/auth/login", {
      body: JSON.stringify({
        email: values.email,
        password: values.password,
      }),
      cache: "no-store",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    let body: unknown = null;

    try {
      body = await response.json();
    } catch {
      body = null;
    }

    if (response.ok && isRecord(body) && body.success === true) {
      return { status: "ok" };
    }

    const code = readLoginErrorCode(body);
    return { code, status: "error" };
  } catch {
    return { code: "NETWORK_ERROR", status: "error" };
  }
}

export function adminPostLoginPath(search = ""): string {
  const query = search.startsWith("?") ? search.slice(1) : search;
  const next = new URLSearchParams(query).get("next");

  if (
    next?.startsWith("/admin") === true &&
    !next.startsWith("//") &&
    !next.includes("://")
  ) {
    return next;
  }

  return AUTH_ADMIN_HOME_PATH;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readLoginErrorCode(body: unknown): AuthFormBannerCode {
  if (
    !isRecord(body) ||
    !isRecord(body.error) ||
    typeof body.error.code !== "string"
  ) {
    return "UNEXPECTED_ERROR";
  }

  if (LOGIN_ERROR_CODES.has(body.error.code as AuthFormBannerCode)) {
    return body.error.code as AuthFormBannerCode;
  }

  return "UNEXPECTED_ERROR";
}

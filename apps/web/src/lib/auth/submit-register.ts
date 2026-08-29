import type { RegisterUserValues } from "@/lib/validations/auth.schema";
import type {
  AuthFormBannerCode,
  AuthFormSubmitResult,
} from "@/types/auth-form";

const REGISTER_ERROR_CODES = new Set<AuthFormBannerCode>([
  "EMAIL_ALREADY_REGISTERED",
  "INVALID_REGISTRATION_DATA",
  "NETWORK_ERROR",
  "RATE_LIMITED",
  "UNEXPECTED_ERROR",
]);

async function postRegister(
  path: string,
  values: RegisterUserValues,
): Promise<AuthFormSubmitResult> {
  try {
    const response = await fetch(path, {
      body: JSON.stringify({
        email: values.email,
        name: values.name,
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

    return { code: readRegisterErrorCode(body), status: "error" };
  } catch {
    return { code: "NETWORK_ERROR", status: "error" };
  }
}

export async function submitAdminRegister(
  values: RegisterUserValues,
): Promise<AuthFormSubmitResult> {
  return postRegister("/api/admin/auth/register", values);
}

export async function submitCustomerRegister(
  values: RegisterUserValues,
): Promise<AuthFormSubmitResult> {
  return postRegister("/api/customer/auth/register", values);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readRegisterErrorCode(body: unknown): AuthFormBannerCode {
  if (
    !isRecord(body) ||
    !isRecord(body.error) ||
    typeof body.error.code !== "string"
  ) {
    return "UNEXPECTED_ERROR";
  }

  if (body.error.code === "INVALID_INPUT") {
    const message =
      typeof body.error.message === "string" ? body.error.message : "";

    if (message.toLowerCase().includes("already exists")) {
      return "EMAIL_ALREADY_REGISTERED";
    }

    return "INVALID_REGISTRATION_DATA";
  }

  if (REGISTER_ERROR_CODES.has(body.error.code as AuthFormBannerCode)) {
    return body.error.code as AuthFormBannerCode;
  }

  return "UNEXPECTED_ERROR";
}

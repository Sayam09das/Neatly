import { submitAdminLogin } from "@/lib/auth/submit-login";
import { submitCustomerRegister } from "@/lib/auth/submit-register";
import type {
  ForgotPasswordValues,
  LoginValues,
  RegisterUserValues,
} from "@/lib/validations/auth.schema";
import type {
  AuthFormSubmitResult,
  AuthSocialProvider,
  AuthSocialSubmitResult,
  FrontendAuthStatus,
  ResendVerificationResult,
  ResetPasswordSubmitResult,
} from "@/types/auth-form";

export async function submitLoginForm(
  values: LoginValues,
): Promise<AuthFormSubmitResult> {
  return submitAdminLogin(values);
}

export async function submitRegisterForm(
  values: RegisterUserValues,
): Promise<AuthFormSubmitResult> {
  return submitCustomerRegister(values);
}

export async function submitForgotPasswordForm(
  _values: ForgotPasswordValues,
): Promise<AuthFormSubmitResult> {
  return { status: "ok" };
}

export async function submitResetPasswordForm(_values: {
  password: string;
}): Promise<ResetPasswordSubmitResult> {
  return { status: "ok" };
}

export async function submitResendVerification(
  email?: string,
): Promise<ResendVerificationResult> {
  if (email === undefined || email.trim() === "") {
    return { status: "sent" };
  }

  try {
    const response = await fetch("/api/admin/auth/resend-verification", {
      body: JSON.stringify({ email }),
      cache: "no-store",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (response.ok) {
      return { status: "sent" };
    }

    let body: unknown = null;

    try {
      body = await response.json();
    } catch {
      body = null;
    }

    if (
      typeof body === "object" &&
      body !== null &&
      "error" in body &&
      typeof body.error === "object" &&
      body.error !== null &&
      "code" in body.error &&
      body.error.code === "RATE_LIMITED"
    ) {
      return { code: "RATE_LIMITED", status: "error" };
    }

    return { code: "UNEXPECTED_ERROR", status: "error" };
  } catch {
    return { code: "NETWORK_ERROR", status: "error" };
  }
}

export async function submitSocialAuth(
  _provider: AuthSocialProvider,
): Promise<AuthSocialSubmitResult> {
  return { status: "unavailable" };
}

export const loginUser = submitLoginForm;
export const registerUser = submitRegisterForm;
export const requestPasswordReset = submitForgotPasswordForm;
export const resetPassword = submitResetPasswordForm;
export const resendVerification = submitResendVerification;

export async function submitVerifyEmail(
  token: string,
): Promise<AuthFormSubmitResult> {
  try {
    const response = await fetch("/api/admin/auth/verify-email", {
      body: JSON.stringify({ token }),
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

    if (response.ok) {
      return { status: "ok" };
    }

    if (
      typeof body === "object" &&
      body !== null &&
      "error" in body &&
      typeof body.error === "object" &&
      body.error !== null &&
      "code" in body.error &&
      body.error.code === "TOKEN_EXPIRED"
    ) {
      return { code: "EXPIRED_LINK", status: "error" };
    }

    return { code: "INVALID_LINK", status: "error" };
  } catch {
    return { code: "NETWORK_ERROR", status: "error" };
  }
}

export async function verifyEmail(
  token: string,
): Promise<AuthFormSubmitResult> {
  return submitVerifyEmail(token);
}

export async function logout(): Promise<{ status: "unconnected" }> {
  return { status: "unconnected" };
}

export function getFrontendAuthStatus(): FrontendAuthStatus {
  return "unknown";
}

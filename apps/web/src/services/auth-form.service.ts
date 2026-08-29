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

export async function submitResendVerification(): Promise<ResendVerificationResult> {
  return { status: "sent" };
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

export async function verifyEmail(): Promise<AuthFormSubmitResult> {
  return { status: "ok" };
}

export async function logout(): Promise<{ status: "unconnected" }> {
  return { status: "unconnected" };
}

export function getFrontendAuthStatus(): FrontendAuthStatus {
  return "unknown";
}

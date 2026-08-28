import type {
  ForgotPasswordValues,
  LoginValues,
  RegisterUserValues,
} from "@/lib/validations/auth.schema";

export type LoginFormData = LoginValues;

export type RegisterFormData = RegisterUserValues & {
  confirmPassword: string;
};

export type ForgotPasswordFormData = ForgotPasswordValues;

export type ResetPasswordFormData = {
  confirmPassword: string;
  password: string;
};

export type AuthFormStatus = "idle" | "submitting";

export type LoginFormState = AuthFormStatus;
export type RegisterFormState = AuthFormStatus;
export type ForgotPasswordFormState = AuthFormStatus | "success";
export type ResetPasswordFormState = AuthFormStatus | "success";

export type AuthFormBannerCode =
  | "INVALID_CREDENTIALS"
  | "EMAIL_ALREADY_REGISTERED"
  | "INVALID_REGISTRATION_DATA"
  | "RATE_LIMITED"
  | "NETWORK_ERROR"
  | "UNEXPECTED_ERROR"
  | "EXPIRED_SESSION"
  | "INVALID_LINK"
  | "EXPIRED_LINK";

export type AuthFormSubmitResult =
  | { status: "ok" }
  | { status: "error"; code: AuthFormBannerCode };

export type ResetPasswordSubmitResult =
  | { status: "ok" }
  | { status: "updated" }
  | { status: "error"; code: AuthFormBannerCode };

export type ResendVerificationResult =
  | { status: "sent" }
  | { status: "error"; code: AuthFormBannerCode };

export type LoginFormSubmitHandler = (
  values: LoginFormData,
) => Promise<AuthFormSubmitResult>;

export type RegisterFormSubmitHandler = (
  values: RegisterUserValues,
) => Promise<AuthFormSubmitResult>;

export type ForgotPasswordSubmitHandler = (
  values: ForgotPasswordFormData,
) => Promise<AuthFormSubmitResult>;

export type ResetPasswordSubmitHandler = (
  values: Pick<ResetPasswordFormData, "password">,
) => Promise<ResetPasswordSubmitResult>;

export type ResendVerificationHandler = () => Promise<ResendVerificationResult>;

export type AuthSocialProvider = "google" | "apple" | "facebook";

export type AuthSocialSubmitResult =
  | { status: "unavailable" }
  | { status: "ok" }
  | { status: "error"; code: AuthFormBannerCode };

export type AuthSocialSubmitHandler = (
  provider: AuthSocialProvider,
) => Promise<AuthSocialSubmitResult>;

export type FrontendAuthStatus =
  | "unknown"
  | "authenticated"
  | "unauthenticated";

export type AuthStatusTone = "success" | "error" | "info" | "loading";

export type ResetLinkView = "invalid" | "expired";

export type VerifyEmailView =
  | "idle"
  | "expired"
  | "already-verified"
  | "verified";

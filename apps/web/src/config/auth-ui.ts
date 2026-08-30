import { APP_NAME } from "@neatly/config";
import {
  AUTH_LOGIN_ALIAS_PATH,
  AUTH_REGISTER_ALIAS_PATH,
  AUTH_ROUTES,
} from "@/config/auth";
import { landingFooter } from "@/config/landing";
import { AUTH_ERROR_MESSAGES } from "@/lib/auth/errors";
import type { AuthFormBannerCode } from "@/types/auth-form";

export const AUTH_HOME_PATH = "/";

export const authLegalLinks = landingFooter.legalLinks;

export const authLoginCopy = {
  description: `Simplify your home care and keep a clear cleaning scope with ${APP_NAME}.`,
  emailLabel: "Email",
  emailPlaceholder: "Email",
  forgotPassword: "Forgot Password?",
  heading: "Welcome back!",
  headingId: "login-heading",
  passwordLabel: "Password",
  passwordPlaceholder: "Password",
  registerAction: "Register now",
  registerPrompt: "Not a member?",
  resendVerification: "Resend verification email",
  submit: "Login",
  submitting: "Logging in...",
  title: "Admin Login",
} as const;

export const authRegisterCopy = {
  confirmPasswordLabel: "Confirm password",
  confirmPasswordPlaceholder: "Confirm password",
  description: `Create an account to continue with ${APP_NAME}.`,
  emailLabel: "Email",
  emailPlaceholder: "Email",
  heading: "Create an account",
  headingId: "register-heading",
  loginAction: "Login now",
  loginPrompt: "Already a member?",
  nameLabel: "Full name",
  namePlaceholder: "Full name",
  passwordLabel: "Password",
  passwordPlaceholder: "Password",
  submit: "Register",
  submitting: "Creating account...",
  title: "Create an account",
} as const;

export const authLoginVisual = {
  alt: "A tidy living room with a cleaned wood table, folded cloth, and garden light through tall windows.",
  height: 1536,
  objectPosition: "50% 48%",
  src: "/images/why_use/why_use_03.jpeg",
  width: 2752,
} as const;

export const authRegisterVisual = {
  alt: "A Neatly cleaner wiping a marble kitchen island with a microfiber cloth.",
  height: 1536,
  objectPosition: "50% 32%",
  src: "/images/why_use/why_use_02.jpeg",
  width: 2752,
} as const;

export const authForgotPasswordCopy = {
  backToLogin: "Back to login",
  description:
    "Enter your email and we'll send you instructions to reset your password.",
  emailLabel: "Email",
  emailPlaceholder: "Email",
  heading: "Forgot your password?",
  headingId: "forgot-password-heading",
  submit: "Send reset link",
  submitting: "Sending...",
  successAction: "Try another email",
  successDescription:
    "If an account exists for this email, you'll receive instructions shortly.",
  successHeading: "Check your inbox",
  successHeadingId: "forgot-password-success-heading",
  title: "Forgot password",
} as const;

export const authResetPasswordCopy = {
  backToLogin: "Back to login",
  confirmPasswordLabel: "Confirm password",
  confirmPasswordPlaceholder: "Confirm password",
  continueToLogin: "Continue to login",
  description: "Choose a new password for your account.",
  expiredDescription:
    "This reset link has expired. Request a new one to continue.",
  expiredHeading: "This link has expired",
  heading: "Set a new password",
  headingId: "reset-password-heading",
  invalidDescription:
    "This reset link is invalid. Request a new one to continue.",
  invalidHeading: "This link is invalid",
  passwordLabel: "New password",
  passwordPlaceholder: "New password",
  requestNewLink: "Request a new link",
  submit: "Update password",
  submitting: "Updating password...",
  successDescription: "Your password has been updated successfully.",
  successHeading: "Password updated",
  successHeadingId: "reset-password-success-heading",
  title: "Reset password",
} as const;

export const authVerifyEmailCopy = {
  alreadyVerifiedDescription:
    "This email address is already verified. You can sign in.",
  alreadyVerifiedHeading: "Already verified",
  backToLogin: "Back to login",
  continueToLogin: "Continue to login",
  cooldown: (seconds: number): string =>
    `Resend available in ${String(seconds)}s`,
  description:
    "Please verify your email before signing in. We've sent a verification link to your email address.",
  expiredDescription:
    "This verification link is no longer valid. Request a new one to continue.",
  expiredHeading: "Verification link expired",
  heading: "Check your email",
  headingId: "verify-email-heading",
  inboxWithEmail: (email: string): string =>
    `We've sent a verification link to ${email}. Please verify your email before signing in.`,
  invalidDescription: "This verification link is no longer valid.",
  invalidHeading: "This verification link is no longer valid.",
  resend: "Resend verification email",
  sending: "Sending...",
  sent: "Verification email sent.",
  title: "Verify email",
  verifiedDescription: "Your account is now ready.",
  verifiedHeading: "Email verified successfully.",
  verifyingDescription: "Please wait while we confirm your email address.",
  verifyingHeading: "Verifying your email",
} as const;

export const authRequiredCopy = {
  action: "Sign in",
  description: "Sign in to continue to this page.",
  heading: "Authentication required",
  headingId: "auth-required-heading",
} as const;

export const authSessionLoadingCopy = {
  description: "Please wait while we check your session.",
  heading: "Checking your session",
} as const;

export const authErrorCopy = {
  action: "Try again",
  backToLogin: "Back to login",
  description: "Please try again.",
  heading: "Something went wrong.",
} as const;

export const authFormPaths = {
  forgotPassword: AUTH_ROUTES.forgotPassword,
  home: AUTH_HOME_PATH,
  login: AUTH_LOGIN_ALIAS_PATH,
  register: AUTH_REGISTER_ALIAS_PATH,
  resetPassword: AUTH_ROUTES.resetPassword,
  verifyEmail: AUTH_ROUTES.verifyEmail,
} as const;

export const authSocialCopy = {
  apple: "Continue with Apple",
  divider: "or continue with",
  facebook: "Continue with Facebook",
  google: "Continue with Google",
  unavailable: "Social sign-in isn't connected yet.",
} as const;

export const authPanelCopy = {
  headline: landingFooter.tagline,
} as const;

export const AUTH_PILL_INPUT_CLASS_NAME =
  "min-h-12 rounded-full border-input px-5";

export const AUTH_FORM_BANNER_COPY: Record<AuthFormBannerCode, string> = {
  EMAIL_ALREADY_REGISTERED: "An account with this email already exists.",
  EMAIL_UNVERIFIED: AUTH_ERROR_MESSAGES.EMAIL_UNVERIFIED,
  EXPIRED_LINK: AUTH_ERROR_MESSAGES.TOKEN_EXPIRED,
  EXPIRED_SESSION: AUTH_ERROR_MESSAGES.SESSION_EXPIRED,
  INVALID_CREDENTIALS: AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS,
  INVALID_LINK: AUTH_ERROR_MESSAGES.TOKEN_INVALID,
  INVALID_REGISTRATION_DATA: "Check your details and try again.",
  NETWORK_ERROR: "Unable to connect. Check your connection and try again.",
  RATE_LIMITED: AUTH_ERROR_MESSAGES.RATE_LIMITED,
  UNEXPECTED_ERROR: AUTH_ERROR_MESSAGES.INTERNAL_ERROR,
};

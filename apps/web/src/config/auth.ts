export const AUTH_SESSION_COOKIE_NAME = "neatly_session";
export const AUTH_SESSION_MAX_AGE_SECONDS = 604_800;
export const AUTH_SESSION_COOKIE_PATH = "/";
export const AUTH_SESSION_COOKIE_SAME_SITE = "strict";
export const AUTH_BCRYPT_COST = 12;
export const AUTH_PASSWORD_MIN_LENGTH = 12;
export const AUTH_PASSWORD_MAX_LENGTH = 72;
export const AUTH_TOKEN_BYTES = 32;
export const AUTH_PASSWORD_RESET_TTL_MS = 60 * 60 * 1000;
export const AUTH_RATE_LIMIT_MAX_ATTEMPTS = 5;
export const AUTH_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
export const AUTH_ADMIN_HOME_PATH = "/admin";
export const AUTH_ADMIN_LOGIN_PATH = "/admin/login";
export const AUTH_ADMIN_REGISTER_PATH = "/admin/register";
export const AUTH_ADMIN_FORGOT_PASSWORD_PATH = "/admin/forgot-password";
export const AUTH_ADMIN_RESET_PASSWORD_PATH = "/admin/reset-password";
export const AUTH_ADMIN_VERIFY_EMAIL_PATH = "/admin/verify-email";
export const AUTH_LOGIN_ALIAS_PATH = "/login";
export const AUTH_REGISTER_ALIAS_PATH = "/register";
export const AUTH_FORGOT_PASSWORD_ALIAS_PATH = "/forgot-password";
export const AUTH_RESET_PASSWORD_ALIAS_PATH = "/reset-password";
export const AUTH_VERIFY_EMAIL_ALIAS_PATH = "/verify-email";
export const AUTH_ROUTES = {
  forgotPassword: AUTH_ADMIN_FORGOT_PASSWORD_PATH,
  login: AUTH_ADMIN_LOGIN_PATH,
  register: AUTH_ADMIN_REGISTER_PATH,
  resetPassword: AUTH_ADMIN_RESET_PASSWORD_PATH,
  verifyEmail: AUTH_ADMIN_VERIFY_EMAIL_PATH,
} as const;
export const AUTH_PUBLIC_ADMIN_PATHS = [
  AUTH_ADMIN_LOGIN_PATH,
  AUTH_ADMIN_REGISTER_PATH,
  AUTH_ADMIN_FORGOT_PASSWORD_PATH,
  AUTH_ADMIN_RESET_PASSWORD_PATH,
  AUTH_ADMIN_VERIFY_EMAIL_PATH,
] as const;
export const AUTH_ENTRY_PATHS = [
  AUTH_LOGIN_ALIAS_PATH,
  AUTH_REGISTER_ALIAS_PATH,
  AUTH_FORGOT_PASSWORD_ALIAS_PATH,
  AUTH_RESET_PASSWORD_ALIAS_PATH,
  AUTH_VERIFY_EMAIL_ALIAS_PATH,
  AUTH_ADMIN_LOGIN_PATH,
  AUTH_ADMIN_REGISTER_PATH,
  AUTH_ADMIN_FORGOT_PASSWORD_PATH,
  AUTH_ADMIN_RESET_PASSWORD_PATH,
  AUTH_ADMIN_VERIFY_EMAIL_PATH,
] as const;
export const AUTH_VERIFICATION_RESEND_COOLDOWN_SECONDS = 45;
export const AUTH_GENERIC_RESET_NOTICE =
  "If an account exists for this email, instructions have been sent.";

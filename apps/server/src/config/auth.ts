export const AUTH_SESSION_MAX_AGE_SECONDS = 604_800;
export const AUTH_BCRYPT_COST = 12;
export const AUTH_PASSWORD_MIN_LENGTH = 12;
export const AUTH_PASSWORD_MAX_LENGTH = 72;
export const AUTH_EMAIL_MAX_LENGTH = 254;
export const AUTH_NAME_MIN_LENGTH = 2;
export const AUTH_NAME_MAX_LENGTH = 80;
export const AUTH_TOKEN_BYTES = 32;
export const AUTH_PASSWORD_RESET_TTL_MS = 60 * 60 * 1000;
export const AUTH_EMAIL_VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000;
export const AUTH_CLEANER_INVITATION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
export const AUTH_CLEANER_ACTIVATE_PATH = "/cleaner/activate";
export const AUTH_RATE_LIMIT_MAX_ATTEMPTS = 5;
export const AUTH_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
export const AUTH_SESSION_SECRET_MIN_LENGTH = 32;
export const AUTH_SESSION_TOKEN_HEADER = "x-session-token";
export const AUTH_ADMIN_RESET_PASSWORD_PATH = "/admin/reset-password";
export const AUTH_ADMIN_VERIFY_EMAIL_PATH = "/admin/verify-email";
export const AUTH_GENERIC_RESET_NOTICE =
  "If an account exists for this email, instructions have been sent.";
export const AUTH_GENERIC_VERIFY_NOTICE =
  "If an account exists for this email, instructions have been sent.";
export const AUTH_ADMIN_ROLES = [
  "ADMIN",
  "SUPER_ADMIN",
  "CONTENT_MANAGER",
  "STAFF",
] as const;
export const AUTH_OPERATOR_ROLES = [
  "ADMIN",
  "SUPER_ADMIN",
  "CONTENT_MANAGER",
] as const;

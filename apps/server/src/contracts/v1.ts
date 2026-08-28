import { API_PREFIX } from "../config/constants.ts";

export { API_PREFIX };

export const API_PATHS = {
  admin: `${API_PREFIX}/admin`,
  api: "/api",
  authForgotPassword: `${API_PREFIX}/auth/forgot-password`,
  authLogin: `${API_PREFIX}/auth/login`,
  authLogout: `${API_PREFIX}/auth/logout`,
  authRegister: `${API_PREFIX}/auth/register`,
  authResendVerification: `${API_PREFIX}/auth/resend-verification`,
  authResetPassword: `${API_PREFIX}/auth/reset-password`,
  authSession: `${API_PREFIX}/auth/session`,
  authVerifyEmail: `${API_PREFIX}/auth/verify-email`,
  health: "/health",
  ready: "/ready",
  root: "/",
  v1: API_PREFIX,
} as const;

export type ApiPath = (typeof API_PATHS)[keyof typeof API_PATHS];

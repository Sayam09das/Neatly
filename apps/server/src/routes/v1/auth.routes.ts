import { API_PATHS } from "../../contracts/v1.ts";
import {
  forgotPasswordController,
  loginController,
  logoutController,
  registerController,
  resendVerificationController,
  resetPasswordController,
  sessionController,
  verifyEmailController,
} from "../../controllers/auth.controller.ts";
import type { RouteDefinition } from "../../lib/router.ts";

export const authRoutes: readonly RouteDefinition[] = [
  {
    handler: registerController,
    method: "POST",
    path: API_PATHS.authRegister,
  },
  {
    handler: loginController,
    method: "POST",
    path: API_PATHS.authLogin,
  },
  {
    handler: logoutController,
    method: "POST",
    path: API_PATHS.authLogout,
  },
  {
    handler: sessionController,
    method: "GET",
    path: API_PATHS.authSession,
  },
  {
    handler: forgotPasswordController,
    method: "POST",
    path: API_PATHS.authForgotPassword,
  },
  {
    handler: resetPasswordController,
    method: "POST",
    path: API_PATHS.authResetPassword,
  },
  {
    handler: verifyEmailController,
    method: "POST",
    path: API_PATHS.authVerifyEmail,
  },
  {
    handler: resendVerificationController,
    method: "POST",
    path: API_PATHS.authResendVerification,
  },
];

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
import {
  forgotPasswordSchema,
  loginSchema,
  registerUserSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "../../lib/validations/auth.schema.ts";
import { limitAuthMutations } from "../../middleware/rate-limit.ts";
import { validateBody } from "../../middleware/validate.ts";

export const authRoutes: readonly RouteDefinition[] = [
  {
    handler: registerController,
    method: "POST",
    middleware: [limitAuthMutations, validateBody(registerUserSchema)],
    path: API_PATHS.authRegister,
  },
  {
    handler: loginController,
    method: "POST",
    middleware: [limitAuthMutations, validateBody(loginSchema)],
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
    middleware: [limitAuthMutations, validateBody(forgotPasswordSchema)],
    path: API_PATHS.authForgotPassword,
  },
  {
    handler: resetPasswordController,
    method: "POST",
    middleware: [limitAuthMutations, validateBody(resetPasswordSchema)],
    path: API_PATHS.authResetPassword,
  },
  {
    handler: verifyEmailController,
    method: "POST",
    middleware: [limitAuthMutations, validateBody(verifyEmailSchema)],
    path: API_PATHS.authVerifyEmail,
  },
  {
    handler: resendVerificationController,
    method: "POST",
    middleware: [limitAuthMutations, validateBody(resendVerificationSchema)],
    path: API_PATHS.authResendVerification,
  },
];

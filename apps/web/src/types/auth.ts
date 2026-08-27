export type AuthUserRole =
  | "ADMIN"
  | "SUPER_ADMIN"
  | "CONTENT_MANAGER"
  | "STAFF";

export type AuthUserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: AuthUserRole;
  status: AuthUserStatus;
  lastLoginAt: Date | null;
}

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
}

export interface AuthSessionResult {
  user: AuthUser;
  sessionToken: string;
  expiresAt: Date;
}

export type AuthErrorCode =
  | "INVALID_INPUT"
  | "INVALID_CREDENTIALS"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "SESSION_EXPIRED"
  | "TOKEN_EXPIRED"
  | "TOKEN_INVALID"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR";

export interface AuthFieldIssue {
  field: string;
  issue: string;
}

export type AuthUserRole =
  | "ADMIN"
  | "CONTENT_MANAGER"
  | "STAFF"
  | "SUPER_ADMIN";

export type AuthUserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface AuthUser {
  email: string;
  id: string;
  lastLoginAt: Date | null;
  name: string;
  role: AuthUserRole;
  status: AuthUserStatus;
}

export interface AuthSessionResult {
  expiresAt: Date;
  sessionToken: string;
  user: AuthUser;
}

export type AuthErrorCode =
  | "EMAIL_UNVERIFIED"
  | "FORBIDDEN"
  | "INTERNAL_ERROR"
  | "INVALID_CREDENTIALS"
  | "INVALID_INPUT"
  | "RATE_LIMITED"
  | "SESSION_EXPIRED"
  | "TOKEN_EXPIRED"
  | "TOKEN_INVALID"
  | "UNAUTHORIZED";

export interface AuthFieldIssue {
  field: string;
  issue: string;
}

export function toAuthUser(record: {
  email: string;
  id: string;
  lastLoginAt: Date | null;
  name: string;
  role: AuthUserRole;
  status: AuthUserStatus;
}): AuthUser {
  return {
    id: record.id,
    name: record.name,
    email: record.email,
    role: record.role,
    status: record.status,
    lastLoginAt: record.lastLoginAt,
  };
}

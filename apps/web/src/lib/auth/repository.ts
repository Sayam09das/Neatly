import type { AuthUser, AuthUserRole, AuthUserStatus } from "@/types/auth";

export interface AuthUserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: AuthUserRole;
  status: AuthUserStatus;
  lastLoginAt: Date | null;
}

export interface AuthSessionRecord {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}

export interface AuthPasswordResetRecord {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  usedAt: Date | null;
}

export interface CreateUserRecordInput {
  name: string;
  email: string;
  passwordHash: string;
  role?: AuthUserRole;
  status?: AuthUserStatus;
}

export interface CreateSessionRecordInput {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}

export interface CreatePasswordResetRecordInput {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}

export interface AuthRepository {
  findUserByEmail(email: string): Promise<AuthUserRecord | null>;
  findUserById(id: string): Promise<AuthUserRecord | null>;
  createUser(input: CreateUserRecordInput): Promise<AuthUserRecord>;
  updatePasswordHash(userId: string, passwordHash: string): Promise<void>;
  markLogin(userId: string, at: Date): Promise<void>;
  createSession(input: CreateSessionRecordInput): Promise<AuthSessionRecord>;
  findSessionByTokenHash(tokenHash: string): Promise<AuthSessionRecord | null>;
  deleteSessionByTokenHash(tokenHash: string): Promise<void>;
  deleteSessionsForUser(userId: string): Promise<void>;
  createPasswordResetToken(
    input: CreatePasswordResetRecordInput,
  ): Promise<AuthPasswordResetRecord>;
  findPasswordResetTokenByHash(
    tokenHash: string,
  ): Promise<AuthPasswordResetRecord | null>;
  consumePasswordResetToken(tokenId: string, usedAt: Date): Promise<boolean>;
  deletePasswordResetTokensForUser(userId: string): Promise<void>;
  completePasswordReset(input: {
    tokenId: string;
    userId: string;
    passwordHash: string;
    usedAt: Date;
  }): Promise<boolean>;
}

export function toAuthUser(record: AuthUserRecord): AuthUser {
  return {
    id: record.id,
    name: record.name,
    email: record.email,
    role: record.role,
    status: record.status,
    lastLoginAt: record.lastLoginAt,
  };
}

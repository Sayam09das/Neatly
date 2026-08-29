import type { AuthUserRole, AuthUserStatus } from "./types.ts";

export interface AuthUserRecord {
  email: string;
  emailVerifiedAt: Date | null;
  id: string;
  lastLoginAt: Date | null;
  name: string;
  passwordHash: string;
  role: AuthUserRole;
  status: AuthUserStatus;
}

export interface AuthSessionRecord {
  createdAt: Date;
  expiresAt: Date;
  id: string;
  tokenHash: string;
  userId: string;
}

export interface AuthPasswordResetRecord {
  expiresAt: Date;
  id: string;
  tokenHash: string;
  usedAt: Date | null;
  userId: string;
}

export interface AuthEmailVerificationRecord {
  expiresAt: Date;
  id: string;
  tokenHash: string;
  usedAt: Date | null;
  userId: string;
}

export interface CreateUserRecordInput {
  email: string;
  name: string;
  passwordHash: string;
  role?: AuthUserRole;
  status?: AuthUserStatus;
}

export interface CreateSessionRecordInput {
  expiresAt: Date;
  tokenHash: string;
  userId: string;
}

export interface CreatePasswordResetRecordInput {
  expiresAt: Date;
  tokenHash: string;
  userId: string;
}

export interface CreateEmailVerificationRecordInput {
  expiresAt: Date;
  tokenHash: string;
  userId: string;
}

export interface AuthRepository {
  completePasswordReset(input: {
    passwordHash: string;
    tokenId: string;
    usedAt: Date;
    userId: string;
  }): Promise<boolean>;
  consumeEmailVerificationToken(
    tokenId: string,
    usedAt: Date,
  ): Promise<boolean>;
  consumePasswordResetToken(tokenId: string, usedAt: Date): Promise<boolean>;
  createEmailVerificationToken(
    input: CreateEmailVerificationRecordInput,
  ): Promise<AuthEmailVerificationRecord>;
  createPasswordResetToken(
    input: CreatePasswordResetRecordInput,
  ): Promise<AuthPasswordResetRecord>;
  createSession(input: CreateSessionRecordInput): Promise<AuthSessionRecord>;
  createUser(input: CreateUserRecordInput): Promise<AuthUserRecord>;
  deleteEmailVerificationTokensForUser(userId: string): Promise<void>;
  deletePasswordResetTokensForUser(userId: string): Promise<void>;
  deleteSessionById(id: string, userId: string): Promise<boolean>;
  deleteSessionByTokenHash(tokenHash: string): Promise<void>;
  deleteSessionsForUser(userId: string): Promise<void>;
  deleteSessionsForUserExcept(
    userId: string,
    keepTokenHash: string,
  ): Promise<void>;
  findSessionById(id: string): Promise<AuthSessionRecord | null>;
  listSessionsByUserId(userId: string): Promise<readonly AuthSessionRecord[]>;
  findEmailVerificationTokenByHash(
    tokenHash: string,
  ): Promise<AuthEmailVerificationRecord | null>;
  findPasswordResetTokenByHash(
    tokenHash: string,
  ): Promise<AuthPasswordResetRecord | null>;
  findSessionByTokenHash(tokenHash: string): Promise<AuthSessionRecord | null>;
  findUserByEmail(email: string): Promise<AuthUserRecord | null>;
  findUserById(id: string): Promise<AuthUserRecord | null>;
  markEmailVerified(userId: string, at: Date): Promise<void>;
  markLogin(userId: string, at: Date): Promise<void>;
  updatePasswordHash(userId: string, passwordHash: string): Promise<void>;
}

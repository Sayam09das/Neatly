import type { z } from "@neatly/config/zod";
import {
  AUTH_ADMIN_RESET_PASSWORD_PATH,
  AUTH_ADMIN_VERIFY_EMAIL_PATH,
  AUTH_CLEANER_ACTIVATE_PATH,
  AUTH_CLEANER_INVITATION_TTL_MS,
  AUTH_CUSTOMER_VERIFY_EMAIL_PATH,
  AUTH_EMAIL_VERIFICATION_TTL_MS,
  AUTH_GENERIC_RESET_NOTICE,
  AUTH_GENERIC_VERIFY_NOTICE,
  AUTH_PASSWORD_RESET_TTL_MS,
  AUTH_SESSION_MAX_AGE_SECONDS,
} from "../config/auth.ts";
import { isAdminOperatorRole, isAdminRole } from "../lib/auth/authorization.ts";
import { AUTH_ERROR_MESSAGES, AuthError } from "../lib/auth/errors.ts";
import { logAuthEvent } from "../lib/auth/logger.ts";
import { hashPassword, verifyPassword } from "../lib/auth/password.ts";
import { MemoryRateLimiter } from "../lib/auth/rate-limit.ts";
import type { AuthRepository, AuthUserRecord } from "../lib/auth/repository.ts";
import { generateAuthToken, hashAuthToken } from "../lib/auth/tokens.ts";
import {
  type AuthSessionResult,
  type AuthUser,
  type AuthUserRole,
  toAuthUser,
} from "../lib/auth/types.ts";
import { ValidationError } from "../lib/errors.ts";
import {
  activateCleanerInvitationSchema,
  forgotPasswordSchema,
  loginSchema,
  registerUserSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "../lib/validations/auth.schema.ts";
import { parseWithSchema } from "../lib/validations/parse.ts";
import type { EmailService } from "./email.service.ts";

const DUMMY_PASSWORD_GUARD = "invalid-credential-timing-guard";

export interface AuthServiceContext {
  ip: string;
}

export interface AuthServiceOptions {
  loginLimiter?: MemoryRateLimiter;
  now?: () => Date;
  resetLimiter?: MemoryRateLimiter;
  siteUrl?: string;
  verifyLimiter?: MemoryRateLimiter;
}

export interface CustomerAccountSessionView {
  createdAt: string;
  current: boolean;
  expiresAt: string;
  id: string;
}

export interface CustomerAccountView {
  email: string;
  emailVerified: boolean;
  sessions: readonly CustomerAccountSessionView[];
  status: AuthUser["status"];
}

export type CleanerInvitationInspection =
  | { email: string; name: string; status: "valid" }
  | { status: "expired" }
  | { status: "invalid" };

export interface CreateInvitedStaffUserResult {
  invitationSent: boolean;
  userId: string;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function parseSchema<T>(schema: z.ZodType<T>, input: unknown): T {
  try {
    return parseWithSchema(schema, input);
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      throw new AuthError("INVALID_INPUT", error.message, error.details);
    }

    throw error;
  }
}

export class AuthService {
  private dummyPasswordHash: string | undefined;
  private readonly emailService: EmailService;
  private readonly loginLimiter: MemoryRateLimiter;
  private readonly now: () => Date;
  private readonly options: AuthServiceOptions;
  private readonly repository: AuthRepository;
  private readonly resetLimiter: MemoryRateLimiter;
  private readonly sessionSecret: string;
  private readonly verifyLimiter: MemoryRateLimiter;

  public constructor(
    repository: AuthRepository,
    emailService: EmailService,
    sessionSecret: string,
    options: AuthServiceOptions = {},
  ) {
    this.repository = repository;
    this.emailService = emailService;
    this.sessionSecret = sessionSecret;
    this.options = options;
    this.now = options.now ?? ((): Date => new Date());
    this.loginLimiter = options.loginLimiter ?? new MemoryRateLimiter();
    this.resetLimiter = options.resetLimiter ?? new MemoryRateLimiter();
    this.verifyLimiter = options.verifyLimiter ?? new MemoryRateLimiter();
  }

  public async registerUser(
    input: unknown,
    options: { role?: AuthUserRole; verifyEmail?: boolean } = {},
  ): Promise<AuthUser> {
    const values = parseSchema(registerUserSchema, input);
    const email = normalizeEmail(values.email);
    const existing = await this.repository.findUserByEmail(email);

    if (existing !== null) {
      throw new AuthError(
        "INVALID_INPUT",
        "An account with this email already exists.",
        [
          {
            field: "email",
            issue: "An account with this email already exists.",
          },
        ],
      );
    }

    const passwordHash = await hashPassword(values.password);
    const verifiedAt = options.verifyEmail === true ? this.now() : null;
    const user = await this.repository.createUser({
      email,
      emailVerifiedAt: verifiedAt,
      name: values.name,
      passwordHash,
      role: options.role,
    });

    if (verifiedAt === null) {
      await this.dispatchVerificationEmail(user.id, user.email, user.role);
    }

    return toAuthUser(user);
  }

  public async authenticateUser(
    input: unknown,
    context: AuthServiceContext,
  ): Promise<AuthSessionResult> {
    const values = parseSchema(loginSchema, input);

    if (!this.loginLimiter.consume(`login:${context.ip}`)) {
      throw new AuthError("RATE_LIMITED", AUTH_ERROR_MESSAGES.RATE_LIMITED);
    }

    const email = normalizeEmail(values.email);
    const user = await this.repository.findUserByEmail(email);
    const passwordHash =
      user?.passwordHash ?? (await this.getDummyPasswordHash());
    const passwordMatches = await verifyPassword(values.password, passwordHash);

    if (user === null || !passwordMatches || !isAdminRole(user.role)) {
      throw new AuthError(
        "INVALID_CREDENTIALS",
        AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS,
      );
    }

    if (user.status !== "ACTIVE") {
      throw new AuthError(
        "INVALID_CREDENTIALS",
        AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS,
      );
    }

    if (user.emailVerifiedAt === null) {
      if (!isAdminOperatorRole(user.role)) {
        throw new AuthError(
          "EMAIL_UNVERIFIED",
          AUTH_ERROR_MESSAGES.EMAIL_UNVERIFIED,
        );
      }

      throw new AuthError(
        "INVALID_CREDENTIALS",
        AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS,
      );
    }

    this.loginLimiter.reset(`login:${context.ip}`);

    const sessionToken = generateAuthToken();
    const createdAt = this.now();
    const expiresAt = new Date(
      createdAt.getTime() + AUTH_SESSION_MAX_AGE_SECONDS * 1000,
    );

    await this.repository.createSession({
      expiresAt,
      tokenHash: hashAuthToken(sessionToken, this.sessionSecret),
      userId: user.id,
    });
    await this.repository.markLogin(user.id, createdAt);

    return {
      expiresAt,
      sessionToken,
      user: toAuthUser({ ...user, lastLoginAt: createdAt }),
    };
  }

  public async resolveSession(
    sessionToken: string | undefined,
  ): Promise<AuthUser | null> {
    if (sessionToken === undefined || sessionToken.trim() === "") {
      return null;
    }

    const session = await this.repository.findSessionByTokenHash(
      hashAuthToken(sessionToken, this.sessionSecret),
    );

    if (session === null) {
      return null;
    }

    if (session.expiresAt.getTime() <= this.now().getTime()) {
      await this.repository.deleteSessionByTokenHash(session.tokenHash);
      return null;
    }

    const user = await this.repository.findUserById(session.userId);

    if (
      user === null ||
      user.status !== "ACTIVE" ||
      user.emailVerifiedAt === null
    ) {
      await this.repository.deleteSessionByTokenHash(session.tokenHash);
      return null;
    }

    return toAuthUser(user);
  }

  public async logout(sessionToken: string | undefined): Promise<void> {
    if (sessionToken === undefined || sessionToken.trim() === "") {
      return;
    }

    await this.repository.deleteSessionByTokenHash(
      hashAuthToken(sessionToken, this.sessionSecret),
    );
  }

  public async getAccountSecurity(
    userId: string,
    sessionToken: string | undefined,
  ): Promise<CustomerAccountView> {
    const user = await this.repository.findUserById(userId);

    if (user === null) {
      throw new AuthError("UNAUTHORIZED", AUTH_ERROR_MESSAGES.UNAUTHORIZED);
    }

    const currentHash =
      sessionToken === undefined || sessionToken.trim() === ""
        ? null
        : hashAuthToken(sessionToken, this.sessionSecret);
    const now = this.now().getTime();
    const sessions = await this.repository.listSessionsByUserId(user.id);

    return {
      email: user.email,
      emailVerified: user.emailVerifiedAt !== null,
      sessions: sessions
        .filter((session) => session.expiresAt.getTime() > now)
        .map((session) => ({
          createdAt: session.createdAt.toISOString(),
          current: currentHash !== null && session.tokenHash === currentHash,
          expiresAt: session.expiresAt.toISOString(),
          id: session.id,
        })),
      status: user.status,
    };
  }

  public async changeOwnPassword(
    userId: string,
    sessionToken: string | undefined,
    input: { currentPassword: string; password: string },
    context: AuthServiceContext,
  ): Promise<void> {
    if (!this.resetLimiter.consume(`password:${userId}:${context.ip}`)) {
      throw new AuthError("RATE_LIMITED", AUTH_ERROR_MESSAGES.RATE_LIMITED);
    }

    const user = await this.repository.findUserById(userId);

    if (user === null) {
      throw new AuthError("UNAUTHORIZED", AUTH_ERROR_MESSAGES.UNAUTHORIZED);
    }

    const matches = await verifyPassword(
      input.currentPassword,
      user.passwordHash,
    );

    if (!matches) {
      throw new AuthError("INVALID_INPUT", "Current password is incorrect.", [
        { field: "currentPassword", issue: "Current password is incorrect." },
      ]);
    }

    if (input.password === input.currentPassword) {
      throw new AuthError("INVALID_INPUT", "Choose a different password.", [
        { field: "password", issue: "Choose a different password." },
      ]);
    }

    const passwordHash = await hashPassword(input.password);
    await this.repository.updatePasswordHash(user.id, passwordHash);

    if (sessionToken !== undefined && sessionToken.trim() !== "") {
      await this.repository.deleteSessionsForUserExcept(
        user.id,
        hashAuthToken(sessionToken, this.sessionSecret),
      );
      return;
    }

    await this.repository.deleteSessionsForUser(user.id);
  }

  public async revokeOwnSession(
    userId: string,
    sessionId: string,
  ): Promise<void> {
    const deleted = await this.repository.deleteSessionById(sessionId, userId);

    if (!deleted) {
      throw new AuthError("TOKEN_INVALID", AUTH_ERROR_MESSAGES.TOKEN_INVALID);
    }
  }

  public async logoutAllOwnSessions(userId: string): Promise<void> {
    await this.repository.deleteSessionsForUser(userId);
  }

  public async requestOwnEmailVerification(
    email: string,
    context: AuthServiceContext,
  ): Promise<{ message: string }> {
    return this.requestEmailVerification({ email }, context);
  }

  public async requestPasswordReset(
    input: unknown,
    context: AuthServiceContext,
  ): Promise<{ message: string }> {
    const values = parseSchema(forgotPasswordSchema, input);

    if (!this.resetLimiter.consume(`forgot:${context.ip}`)) {
      throw new AuthError("RATE_LIMITED", AUTH_ERROR_MESSAGES.RATE_LIMITED);
    }

    const email = normalizeEmail(values.email);
    const user = await this.repository.findUserByEmail(email);
    const siteUrl = this.options.siteUrl;

    if (
      user !== null &&
      user.status === "ACTIVE" &&
      siteUrl !== undefined &&
      siteUrl.trim() !== ""
    ) {
      await this.repository.deletePasswordResetTokensForUser(user.id);

      const token = generateAuthToken();
      const createdAt = this.now();

      await this.repository.createPasswordResetToken({
        expiresAt: new Date(createdAt.getTime() + AUTH_PASSWORD_RESET_TTL_MS),
        tokenHash: hashAuthToken(token, this.sessionSecret),
        userId: user.id,
      });

      try {
        await this.emailService.sendPasswordResetEmail({
          resetUrl: this.buildResetUrl(token, siteUrl),
          to: user.email,
        });
      } catch {
        logAuthEvent({
          outcome: "failure",
          type: "password_reset_email_failed",
        });
      }
    }

    return { message: AUTH_GENERIC_RESET_NOTICE };
  }

  public async resetPassword(
    input: unknown,
    context: AuthServiceContext,
  ): Promise<AuthUser> {
    const values = parseSchema(resetPasswordSchema, input);

    if (!this.resetLimiter.consume(`reset:${context.ip}`)) {
      throw new AuthError("RATE_LIMITED", AUTH_ERROR_MESSAGES.RATE_LIMITED);
    }

    const record = await this.repository.findPasswordResetTokenByHash(
      hashAuthToken(values.token, this.sessionSecret),
    );

    if (record === null || record.usedAt !== null) {
      throw new AuthError("TOKEN_INVALID", AUTH_ERROR_MESSAGES.TOKEN_INVALID);
    }

    if (record.expiresAt.getTime() <= this.now().getTime()) {
      throw new AuthError("TOKEN_EXPIRED", AUTH_ERROR_MESSAGES.TOKEN_EXPIRED);
    }

    const passwordHash = await hashPassword(values.password);
    const consumed = await this.repository.completePasswordReset({
      passwordHash,
      tokenId: record.id,
      usedAt: this.now(),
      userId: record.userId,
    });

    if (!consumed) {
      throw new AuthError("TOKEN_INVALID", AUTH_ERROR_MESSAGES.TOKEN_INVALID);
    }

    const user = await this.repository.findUserById(record.userId);

    if (user === null) {
      throw new AuthError("TOKEN_INVALID", AUTH_ERROR_MESSAGES.TOKEN_INVALID);
    }

    return toAuthUser(user);
  }

  public async requestEmailVerification(
    input: unknown,
    context: AuthServiceContext,
  ): Promise<{ message: string }> {
    const values = parseSchema(resendVerificationSchema, input);

    if (!this.verifyLimiter.consume(`verify:${context.ip}`)) {
      throw new AuthError("RATE_LIMITED", AUTH_ERROR_MESSAGES.RATE_LIMITED);
    }

    const email = normalizeEmail(values.email);
    const user = await this.repository.findUserByEmail(email);

    if (
      user !== null &&
      user.status === "ACTIVE" &&
      user.emailVerifiedAt === null
    ) {
      await this.dispatchVerificationEmail(user.id, user.email, user.role);
    }

    return { message: AUTH_GENERIC_VERIFY_NOTICE };
  }

  public async verifyEmail(
    input: unknown,
    context: AuthServiceContext = { ip: "unknown" },
  ): Promise<AuthUser> {
    const values = parseSchema(verifyEmailSchema, input);

    if (!this.verifyLimiter.consume(`verify-token:${context.ip}`)) {
      throw new AuthError("RATE_LIMITED", AUTH_ERROR_MESSAGES.RATE_LIMITED);
    }

    const record = await this.repository.findEmailVerificationTokenByHash(
      hashAuthToken(values.token, this.sessionSecret),
    );

    if (record === null || record.usedAt !== null) {
      throw new AuthError("TOKEN_INVALID", AUTH_ERROR_MESSAGES.TOKEN_INVALID);
    }

    if (record.expiresAt.getTime() <= this.now().getTime()) {
      throw new AuthError("TOKEN_EXPIRED", AUTH_ERROR_MESSAGES.TOKEN_EXPIRED);
    }

    const usedAt = this.now();
    const consumed = await this.repository.consumeEmailVerificationToken(
      record.id,
      usedAt,
    );

    if (!consumed) {
      throw new AuthError("TOKEN_INVALID", AUTH_ERROR_MESSAGES.TOKEN_INVALID);
    }

    await this.repository.markEmailVerified(record.userId, usedAt);
    await this.repository.deleteEmailVerificationTokensForUser(record.userId);

    const user = await this.repository.findUserById(record.userId);

    if (user === null) {
      throw new AuthError("TOKEN_INVALID", AUTH_ERROR_MESSAGES.TOKEN_INVALID);
    }

    return toAuthUser(user);
  }

  public async findUserByEmail(email: string): Promise<AuthUserRecord | null> {
    return this.repository.findUserByEmail(normalizeEmail(email));
  }

  public async findUserById(id: string): Promise<AuthUserRecord | null> {
    return this.repository.findUserById(id);
  }

  public async setUserStatus(
    userId: string,
    status: AuthUser["status"],
  ): Promise<void> {
    await this.repository.updateUserStatus(userId, status);
  }

  public async revokeAllSessions(userId: string): Promise<void> {
    await this.repository.deleteSessionsForUser(userId);
  }

  public async createInvitedStaffUser(input: {
    email: string;
    name: string;
  }): Promise<CreateInvitedStaffUserResult> {
    const email = normalizeEmail(input.email);
    const existing = await this.repository.findUserByEmail(email);

    if (existing !== null) {
      throw new AuthError(
        "INVALID_INPUT",
        "An account with this email already exists.",
        [
          {
            field: "email",
            issue: "An account with this email already exists.",
          },
        ],
      );
    }

    const passwordHash = await hashPassword(generateAuthToken());
    const user = await this.repository.createUser({
      email,
      emailVerifiedAt: null,
      name: input.name.trim(),
      passwordHash,
      role: "STAFF",
      status: "INACTIVE",
    });
    const invitationSent = await this.dispatchCleanerInvitationEmail(
      user.id,
      user.email,
      user.name,
    );

    return { invitationSent, userId: user.id };
  }

  public async resendCleanerInvitation(
    userId: string,
    context: AuthServiceContext,
  ): Promise<boolean> {
    if (!this.verifyLimiter.consume(`cleaner-invite:${userId}:${context.ip}`)) {
      throw new AuthError("RATE_LIMITED", AUTH_ERROR_MESSAGES.RATE_LIMITED);
    }

    const user = await this.repository.findUserById(userId);

    if (user === null || user.emailVerifiedAt !== null) {
      throw new AuthError("INVALID_INPUT", "This invitation cannot be resent.");
    }

    return this.dispatchCleanerInvitationEmail(user.id, user.email, user.name);
  }

  public async inspectCleanerInvitation(
    token: string,
  ): Promise<CleanerInvitationInspection> {
    const record = await this.findInvitationRecord(token);

    if (record === null) {
      return { status: "invalid" };
    }

    if (record.expiresAt.getTime() <= this.now().getTime()) {
      return { status: "expired" };
    }

    const user = await this.repository.findUserById(record.userId);

    if (user === null || user.emailVerifiedAt !== null) {
      return { status: "invalid" };
    }

    return { email: user.email, name: user.name, status: "valid" };
  }

  public async activateCleanerInvitation(
    input: unknown,
    context: AuthServiceContext,
  ): Promise<AuthSessionResult> {
    const values = parseSchema(activateCleanerInvitationSchema, input);

    if (!this.verifyLimiter.consume(`cleaner-activate:${context.ip}`)) {
      throw new AuthError("RATE_LIMITED", AUTH_ERROR_MESSAGES.RATE_LIMITED);
    }

    const record = await this.findInvitationRecord(values.token);

    if (record === null) {
      throw new AuthError("TOKEN_INVALID", AUTH_ERROR_MESSAGES.TOKEN_INVALID);
    }

    if (record.expiresAt.getTime() <= this.now().getTime()) {
      throw new AuthError("TOKEN_EXPIRED", AUTH_ERROR_MESSAGES.TOKEN_EXPIRED);
    }

    const user = await this.repository.findUserById(record.userId);

    if (user === null || user.emailVerifiedAt !== null) {
      throw new AuthError("TOKEN_INVALID", AUTH_ERROR_MESSAGES.TOKEN_INVALID);
    }

    const usedAt = this.now();
    const passwordHash = await hashPassword(values.password);
    const consumed = await this.repository.consumeEmailVerificationToken(
      record.id,
      usedAt,
    );

    if (!consumed) {
      throw new AuthError("TOKEN_INVALID", AUTH_ERROR_MESSAGES.TOKEN_INVALID);
    }

    await this.repository.updatePasswordHash(user.id, passwordHash);
    await this.repository.markEmailVerified(user.id, usedAt);
    await this.repository.updateUserStatus(user.id, "ACTIVE");
    await this.repository.deleteEmailVerificationTokensForUser(user.id);

    const sessionToken = generateAuthToken();
    const expiresAt = new Date(
      usedAt.getTime() + AUTH_SESSION_MAX_AGE_SECONDS * 1000,
    );

    await this.repository.createSession({
      expiresAt,
      tokenHash: hashAuthToken(sessionToken, this.sessionSecret),
      userId: user.id,
    });
    await this.repository.markLogin(user.id, usedAt);

    return {
      expiresAt,
      sessionToken,
      user: toAuthUser({
        ...user,
        lastLoginAt: usedAt,
        status: "ACTIVE",
      }),
    };
  }

  private async findInvitationRecord(
    token: string,
  ): Promise<Awaited<
    ReturnType<AuthRepository["findEmailVerificationTokenByHash"]>
  > | null> {
    if (token.trim() === "") {
      return null;
    }

    return this.repository.findEmailVerificationTokenByHash(
      hashAuthToken(token, this.sessionSecret),
    );
  }

  private async dispatchCleanerInvitationEmail(
    userId: string,
    email: string,
    name: string,
  ): Promise<boolean> {
    const siteUrl = this.options.siteUrl;

    if (siteUrl === undefined || siteUrl.trim() === "") {
      return false;
    }

    await this.repository.deleteEmailVerificationTokensForUser(userId);

    const token = generateAuthToken();
    const createdAt = this.now();

    await this.repository.createEmailVerificationToken({
      expiresAt: new Date(createdAt.getTime() + AUTH_CLEANER_INVITATION_TTL_MS),
      tokenHash: hashAuthToken(token, this.sessionSecret),
      userId,
    });

    try {
      await this.emailService.sendCleanerInvitationEmail({
        activateUrl: this.buildCleanerInvitationUrl(token, siteUrl),
        expiresInDays: AUTH_CLEANER_INVITATION_TTL_MS / (24 * 60 * 60 * 1000),
        name,
        to: email,
      });
      return true;
    } catch {
      logAuthEvent({
        outcome: "failure",
        type: "cleaner_invitation_email_failed",
      });
      return false;
    }
  }

  private buildCleanerInvitationUrl(token: string, siteUrl: string): string {
    const url = new URL(AUTH_CLEANER_ACTIVATE_PATH, `${siteUrl}/`);
    url.searchParams.set("token", token);
    return url.toString();
  }

  private async dispatchVerificationEmail(
    userId: string,
    email: string,
    role: AuthUserRole,
  ): Promise<void> {
    const siteUrl = this.options.siteUrl;

    if (siteUrl === undefined || siteUrl.trim() === "") {
      return;
    }

    await this.repository.deleteEmailVerificationTokensForUser(userId);

    const token = generateAuthToken();
    const createdAt = this.now();

    await this.repository.createEmailVerificationToken({
      expiresAt: new Date(createdAt.getTime() + AUTH_EMAIL_VERIFICATION_TTL_MS),
      tokenHash: hashAuthToken(token, this.sessionSecret),
      userId,
    });

    try {
      await this.emailService.sendVerificationEmail({
        to: email,
        verifyUrl: this.buildVerifyUrl(token, siteUrl, role),
      });
    } catch {
      logAuthEvent({
        outcome: "failure",
        type: "verification_email_failed",
      });
    }
  }

  private buildResetUrl(token: string, siteUrl: string): string {
    const url = new URL(AUTH_ADMIN_RESET_PASSWORD_PATH, `${siteUrl}/`);
    url.searchParams.set("token", token);
    return url.toString();
  }

  private buildVerifyUrl(
    token: string,
    siteUrl: string,
    role: AuthUserRole,
  ): string {
    const path = isAdminOperatorRole(role)
      ? AUTH_ADMIN_VERIFY_EMAIL_PATH
      : AUTH_CUSTOMER_VERIFY_EMAIL_PATH;
    const url = new URL(path, `${siteUrl}/`);
    url.searchParams.set("token", token);
    return url.toString();
  }

  private async getDummyPasswordHash(): Promise<string> {
    this.dummyPasswordHash ??= await hashPassword(DUMMY_PASSWORD_GUARD);
    return this.dummyPasswordHash;
  }
}

import type { z } from "@neatly/config/zod";
import {
  AUTH_ADMIN_RESET_PASSWORD_PATH,
  AUTH_ADMIN_VERIFY_EMAIL_PATH,
  AUTH_EMAIL_VERIFICATION_TTL_MS,
  AUTH_GENERIC_RESET_NOTICE,
  AUTH_GENERIC_VERIFY_NOTICE,
  AUTH_PASSWORD_RESET_TTL_MS,
  AUTH_SESSION_MAX_AGE_SECONDS,
} from "../config/auth.ts";
import { isAdminRole } from "../lib/auth/authorization.ts";
import { AUTH_ERROR_MESSAGES, AuthError } from "../lib/auth/errors.ts";
import { logAuthEvent } from "../lib/auth/logger.ts";
import { hashPassword, verifyPassword } from "../lib/auth/password.ts";
import { MemoryRateLimiter } from "../lib/auth/rate-limit.ts";
import type { AuthRepository } from "../lib/auth/repository.ts";
import { generateAuthToken, hashAuthToken } from "../lib/auth/tokens.ts";
import {
  type AuthSessionResult,
  type AuthUser,
  toAuthUser,
} from "../lib/auth/types.ts";
import { ValidationError } from "../lib/errors.ts";
import {
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

  public async registerUser(input: unknown): Promise<AuthUser> {
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
    const user = await this.repository.createUser({
      email,
      name: values.name,
      passwordHash,
    });

    await this.dispatchVerificationEmail(user.id, user.email);

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

    if (
      user === null ||
      !passwordMatches ||
      user.status !== "ACTIVE" ||
      user.emailVerifiedAt === null ||
      !isAdminRole(user.role)
    ) {
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
      await this.dispatchVerificationEmail(user.id, user.email);
    }

    return { message: AUTH_GENERIC_VERIFY_NOTICE };
  }

  public async verifyEmail(input: unknown): Promise<AuthUser> {
    const values = parseSchema(verifyEmailSchema, input);
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

  private async dispatchVerificationEmail(
    userId: string,
    email: string,
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
        verifyUrl: this.buildVerifyUrl(token, siteUrl),
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

  private buildVerifyUrl(token: string, siteUrl: string): string {
    const url = new URL(AUTH_ADMIN_VERIFY_EMAIL_PATH, `${siteUrl}/`);
    url.searchParams.set("token", token);
    return url.toString();
  }

  private async getDummyPasswordHash(): Promise<string> {
    this.dummyPasswordHash ??= await hashPassword(DUMMY_PASSWORD_GUARD);
    return this.dummyPasswordHash;
  }
}

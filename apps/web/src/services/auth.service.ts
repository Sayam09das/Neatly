import type { z } from "@neatly/config/zod";
import {
  AUTH_ADMIN_RESET_PASSWORD_PATH,
  AUTH_GENERIC_RESET_NOTICE,
  AUTH_PASSWORD_RESET_TTL_MS,
  AUTH_SESSION_MAX_AGE_SECONDS,
} from "@/config/auth";
import { AUTH_ERROR_MESSAGES, AuthError } from "@/lib/auth/errors";
import { logAuthEvent } from "@/lib/auth/logger";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import {
  loginRateLimiter,
  type MemoryRateLimiter,
  passwordResetRateLimiter,
} from "@/lib/auth/rate-limit";
import type { AuthRepository } from "@/lib/auth/repository";
import { toAuthUser } from "@/lib/auth/repository";
import { generateAuthToken, hashAuthToken } from "@/lib/auth/tokens";
import {
  forgotPasswordSchema,
  loginSchema,
  registerUserSchema,
  resetPasswordSchema,
} from "@/lib/validations/auth.schema";
import type { EmailService } from "@/services/email.service";
import type { AuthSessionResult, AuthUser } from "@/types/auth";

const DUMMY_PASSWORD_GUARD = "invalid-credential-timing-guard";

export interface AuthServiceContext {
  ip: string;
}

export interface AuthServiceOptions {
  now?: () => Date;
  siteUrl?: string;
  loginLimiter?: MemoryRateLimiter;
  resetLimiter?: MemoryRateLimiter;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function parseSchema<T>(schema: z.ZodType<T>, input: unknown): T {
  const result = schema.safeParse(input);

  if (result.success) {
    return result.data;
  }

  throw new AuthError(
    "INVALID_INPUT",
    "Validation failed.",
    result.error.issues.map((issue) => ({
      field: String(issue.path[0] ?? "form"),
      issue: issue.message,
    })),
  );
}

export class AuthService {
  private dummyPasswordHash: string | undefined;
  private readonly now: () => Date;
  private readonly loginLimiter: MemoryRateLimiter;
  private readonly resetLimiter: MemoryRateLimiter;

  public constructor(
    private readonly repository: AuthRepository,
    private readonly emailService: EmailService,
    private readonly sessionSecret: string,
    private readonly options: AuthServiceOptions = {},
  ) {
    this.now = options.now ?? ((): Date => new Date());
    this.loginLimiter = options.loginLimiter ?? loginRateLimiter;
    this.resetLimiter = options.resetLimiter ?? passwordResetRateLimiter;
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
      name: values.name,
      email,
      passwordHash,
    });

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

    if (user === null || !passwordMatches || user.status !== "ACTIVE") {
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
      userId: user.id,
      tokenHash: hashAuthToken(sessionToken, this.sessionSecret),
      expiresAt,
    });
    await this.repository.markLogin(user.id, createdAt);

    return {
      user: toAuthUser({ ...user, lastLoginAt: createdAt }),
      sessionToken,
      expiresAt,
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

    if (user === null || user.status !== "ACTIVE") {
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
        userId: user.id,
        tokenHash: hashAuthToken(token, this.sessionSecret),
        expiresAt: new Date(createdAt.getTime() + AUTH_PASSWORD_RESET_TTL_MS),
      });

      try {
        await this.emailService.sendPasswordResetEmail({
          to: user.email,
          resetUrl: this.buildResetUrl(token, siteUrl),
        });
      } catch {
        logAuthEvent({
          type: "password_reset_email_failed",
          outcome: "failure",
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
      tokenId: record.id,
      userId: record.userId,
      passwordHash,
      usedAt: this.now(),
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

  private buildResetUrl(token: string, siteUrl: string): string {
    const url = new URL(AUTH_ADMIN_RESET_PASSWORD_PATH, `${siteUrl}/`);
    url.searchParams.set("token", token);
    return url.toString();
  }

  private async getDummyPasswordHash(): Promise<string> {
    this.dummyPasswordHash ??= await hashPassword(DUMMY_PASSWORD_GUARD);
    return this.dummyPasswordHash;
  }
}

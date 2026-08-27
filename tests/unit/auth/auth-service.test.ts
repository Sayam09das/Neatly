import { describe, expect, it } from "vitest";
import { AUTH_GENERIC_RESET_NOTICE } from "@/config/auth";
import { AuthError } from "@/lib/auth/errors";
import { verifyPassword } from "@/lib/auth/password";
import { MemoryRateLimiter } from "@/lib/auth/rate-limit";
import { AuthService } from "@/services/auth.service";
import type {
  EmailProvider,
  PasswordResetEmailInput,
  VerificationEmailInput,
} from "@/services/email/provider";
import { EmailService } from "@/services/email.service";
import { InMemoryAuthRepository } from "./in-memory-auth-repository";

const SESSION_SECRET = "test-session-secret-value-32-chars-min";
const SITE_URL = "https://neatly.example";
const ADMIN_PASSWORD = "correct-horse-battery-staple";

class RecordingEmailProvider implements EmailProvider {
  public readonly passwordResets: PasswordResetEmailInput[] = [];
  public readonly verifications: VerificationEmailInput[] = [];

  public async sendPasswordResetEmail(
    input: PasswordResetEmailInput,
  ): Promise<void> {
    this.passwordResets.push(input);
  }

  public async sendVerificationEmail(
    input: VerificationEmailInput,
  ): Promise<void> {
    this.verifications.push(input);
  }
}

function createAuthHarness(now?: () => Date): {
  service: AuthService;
  repository: InMemoryAuthRepository;
  emails: RecordingEmailProvider;
} {
  const repository = new InMemoryAuthRepository();
  const emails = new RecordingEmailProvider();
  const service = new AuthService(
    repository,
    new EmailService(emails),
    SESSION_SECRET,
    {
      now,
      siteUrl: SITE_URL,
      loginLimiter: new MemoryRateLimiter(),
      resetLimiter: new MemoryRateLimiter(),
    },
  );

  return { service, repository, emails };
}

function tokenFromResetUrl(url: string): string {
  return new URL(url).searchParams.get("token") ?? "";
}

describe("AuthService", (): void => {
  it("registers an admin user without returning the password hash", async (): Promise<void> => {
    const { service, repository } = createAuthHarness();
    const user = await service.registerUser({
      name: "Neatly Admin",
      email: "Admin@Neatly.example",
      password: ADMIN_PASSWORD,
    });

    expect(user.email).toBe("admin@neatly.example");
    expect(user.role).toBe("ADMIN");
    expect(user).not.toHaveProperty("passwordHash");
    expect(repository.users[0]?.passwordHash).not.toBe(ADMIN_PASSWORD);
    expect(
      await verifyPassword(
        ADMIN_PASSWORD,
        repository.users[0]?.passwordHash ?? "",
      ),
    ).toBe(true);
  });

  it("rejects duplicate registration with a safe message", async (): Promise<void> => {
    const { service } = createAuthHarness();
    await service.registerUser({
      name: "Neatly Admin",
      email: "admin@neatly.example",
      password: ADMIN_PASSWORD,
    });

    try {
      await service.registerUser({
        name: "Neatly Admin",
        email: "admin@neatly.example",
        password: ADMIN_PASSWORD,
      });
      expect.unreachable();
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(AuthError);
      if (!(error instanceof AuthError)) {
        return;
      }
      expect(error.code).toBe("INVALID_INPUT");
      expect(error.message).toBe("An account with this email already exists.");
      expect(error.message).not.toMatch(/prisma/i);
    }
  });

  it("rejects malformed registration and login payloads", async (): Promise<void> => {
    const { service } = createAuthHarness();

    await expect(
      service.registerUser({ email: "not-an-email" }),
    ).rejects.toMatchObject({
      code: "INVALID_INPUT",
    });
    await expect(
      service.authenticateUser({ email: "a" }, { ip: "1.1.1.1" }),
    ).rejects.toMatchObject({
      code: "INVALID_INPUT",
    });
  });

  it("authenticates valid credentials and resolves the session", async (): Promise<void> => {
    const { service } = createAuthHarness();
    await service.registerUser({
      name: "Neatly Admin",
      email: "admin@neatly.example",
      password: ADMIN_PASSWORD,
    });

    const session = await service.authenticateUser(
      { email: "admin@neatly.example", password: ADMIN_PASSWORD },
      { ip: "203.0.113.10" },
    );

    expect(session.user).not.toHaveProperty("passwordHash");
    expect(session.sessionToken).toMatch(/^[a-f0-9]{64}$/);

    const currentUser = await service.resolveSession(session.sessionToken);
    expect(currentUser?.email).toBe("admin@neatly.example");
  });

  it("rejects invalid credentials without revealing whether the email exists", async (): Promise<void> => {
    const { service } = createAuthHarness();
    await service.registerUser({
      name: "Neatly Admin",
      email: "admin@neatly.example",
      password: ADMIN_PASSWORD,
    });

    try {
      await service.authenticateUser(
        { email: "missing@neatly.example", password: ADMIN_PASSWORD },
        { ip: "203.0.113.11" },
      );
      expect.unreachable();
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(AuthError);
      if (!(error instanceof AuthError)) {
        return;
      }
      expect(error.code).toBe("INVALID_CREDENTIALS");
      expect(error.message).toBe("Invalid email or password.");
    }

    await expect(
      service.authenticateUser(
        { email: "admin@neatly.example", password: "wrong-password-value" },
        { ip: "203.0.113.12" },
      ),
    ).rejects.toMatchObject({
      code: "INVALID_CREDENTIALS",
      message: "Invalid email or password.",
    });
  });

  it("rate limits repeated login attempts from the same IP", async (): Promise<void> => {
    const { service } = createAuthHarness();
    await service.registerUser({
      name: "Neatly Admin",
      email: "admin@neatly.example",
      password: ADMIN_PASSWORD,
    });

    const ip = "203.0.113.13";

    for (let attempt = 0; attempt < 5; attempt += 1) {
      await expect(
        service.authenticateUser(
          { email: "admin@neatly.example", password: "wrong-password-value" },
          { ip },
        ),
      ).rejects.toMatchObject({ code: "INVALID_CREDENTIALS" });
    }

    await expect(
      service.authenticateUser(
        { email: "admin@neatly.example", password: ADMIN_PASSWORD },
        { ip },
      ),
    ).rejects.toMatchObject({ code: "RATE_LIMITED" });
  });

  it("logs the user out and rejects the previous session token", async (): Promise<void> => {
    const { service } = createAuthHarness();
    await service.registerUser({
      name: "Neatly Admin",
      email: "admin@neatly.example",
      password: ADMIN_PASSWORD,
    });
    const session = await service.authenticateUser(
      { email: "admin@neatly.example", password: ADMIN_PASSWORD },
      { ip: "203.0.113.14" },
    );

    await service.logout(session.sessionToken);
    await expect(
      service.resolveSession(session.sessionToken),
    ).resolves.toBeNull();
  });

  it("treats expired sessions as signed out", async (): Promise<void> => {
    let current = new Date("2026-08-27T00:00:00.000Z");
    const { service } = createAuthHarness((): Date => current);
    await service.registerUser({
      name: "Neatly Admin",
      email: "admin@neatly.example",
      password: ADMIN_PASSWORD,
    });
    const session = await service.authenticateUser(
      { email: "admin@neatly.example", password: ADMIN_PASSWORD },
      { ip: "203.0.113.15" },
    );

    current = new Date("2026-09-04T00:00:01.000Z");
    await expect(
      service.resolveSession(session.sessionToken),
    ).resolves.toBeNull();
  });

  it("sends a generic forgot-password response whether or not the email exists", async (): Promise<void> => {
    const { service, emails } = createAuthHarness();
    await service.registerUser({
      name: "Neatly Admin",
      email: "admin@neatly.example",
      password: ADMIN_PASSWORD,
    });

    const existing = await service.requestPasswordReset(
      { email: "admin@neatly.example" },
      { ip: "203.0.113.16" },
    );
    const missing = await service.requestPasswordReset(
      { email: "missing@neatly.example" },
      { ip: "203.0.113.17" },
    );

    expect(existing.message).toBe(AUTH_GENERIC_RESET_NOTICE);
    expect(missing.message).toBe(AUTH_GENERIC_RESET_NOTICE);
    expect(emails.passwordResets).toHaveLength(1);
    expect(emails.passwordResets[0]?.resetUrl).not.toContain(ADMIN_PASSWORD);
  });

  it("resets a password, consumes the token, and invalidates sessions", async (): Promise<void> => {
    const { service, emails } = createAuthHarness();
    await service.registerUser({
      name: "Neatly Admin",
      email: "admin@neatly.example",
      password: ADMIN_PASSWORD,
    });
    const session = await service.authenticateUser(
      { email: "admin@neatly.example", password: ADMIN_PASSWORD },
      { ip: "203.0.113.18" },
    );
    await service.requestPasswordReset(
      { email: "admin@neatly.example" },
      { ip: "203.0.113.19" },
    );

    const token = tokenFromResetUrl(emails.passwordResets[0]?.resetUrl ?? "");
    const nextPassword = "new-correct-horse-battery";
    await service.resetPassword(
      { token, password: nextPassword },
      { ip: "203.0.113.20" },
    );

    await expect(
      service.resolveSession(session.sessionToken),
    ).resolves.toBeNull();
    await expect(
      service.authenticateUser(
        { email: "admin@neatly.example", password: ADMIN_PASSWORD },
        { ip: "203.0.113.21" },
      ),
    ).rejects.toMatchObject({ code: "INVALID_CREDENTIALS" });

    const restored = await service.authenticateUser(
      { email: "admin@neatly.example", password: nextPassword },
      { ip: "203.0.113.22" },
    );
    expect(restored.user.email).toBe("admin@neatly.example");

    await expect(
      service.resetPassword(
        { token, password: "another-valid-password" },
        { ip: "203.0.113.23" },
      ),
    ).rejects.toMatchObject({ code: "TOKEN_INVALID" });
  });

  it("rejects expired and unknown reset tokens", async (): Promise<void> => {
    let current = new Date("2026-08-27T00:00:00.000Z");
    const { service, emails } = createAuthHarness((): Date => current);
    await service.registerUser({
      name: "Neatly Admin",
      email: "admin@neatly.example",
      password: ADMIN_PASSWORD,
    });
    await service.requestPasswordReset(
      { email: "admin@neatly.example" },
      { ip: "203.0.113.24" },
    );
    const token = tokenFromResetUrl(emails.passwordResets[0]?.resetUrl ?? "");

    current = new Date("2026-08-27T01:00:01.000Z");
    await expect(
      service.resetPassword(
        { token, password: "new-correct-horse-battery" },
        { ip: "203.0.113.25" },
      ),
    ).rejects.toMatchObject({ code: "TOKEN_EXPIRED" });

    await expect(
      service.resetPassword(
        { token: "00".repeat(32), password: "new-correct-horse-battery" },
        { ip: "203.0.113.26" },
      ),
    ).rejects.toMatchObject({ code: "TOKEN_INVALID" });
  });
});

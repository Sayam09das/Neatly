import { afterEach, describe, expect, it, vi } from "vitest";
import { SMTP_DEFAULT_HOST } from "../../../apps/server/src/config/constants.ts";
import { logError } from "../../../apps/server/src/lib/logger.ts";
import {
  SmtpEmailProvider,
  type SmtpTransport,
  UnconfiguredEmailProvider,
} from "../../../apps/server/src/services/email/smtp.provider.ts";
import { EmailService } from "../../../apps/server/src/services/email.service.ts";

const PASSWORD = "xsmtpsib-test-password-not-for-production";
const config = {
  fromEmail: "sayamprogrammingworld@gmail.com",
  fromName: "Neatly",
  host: SMTP_DEFAULT_HOST,
  password: PASSWORD,
  port: 587,
  user: "sayamprogrammingworld@gmail.com",
};

vi.mock("../../../apps/server/src/lib/logger.ts", () => ({
  logError: vi.fn(),
  logInfo: vi.fn(),
}));

afterEach((): void => {
  vi.mocked(logError).mockClear();
});

function createTransport(
  overrides: Partial<SmtpTransport> = {},
): SmtpTransport {
  return {
    sendMail: vi.fn().mockResolvedValue({ messageId: "smtp-test" }),
    verify: vi.fn().mockResolvedValue(true),
    ...overrides,
  };
}

describe("SmtpEmailProvider", (): void => {
  it("sends transactional mail through Nodemailer SMTP", async (): Promise<void> => {
    const transport = createTransport();
    const service = new EmailService(
      new SmtpEmailProvider(config, (): SmtpTransport => transport),
    );

    await service.sendVerificationEmail({
      to: "customer@neatly.example",
      verifyUrl: "https://neatly.example/verify-email?token=abc",
    });

    expect(transport.sendMail).toHaveBeenCalledTimes(1);
    expect(transport.sendMail).toHaveBeenCalledWith({
      from: {
        address: "sayamprogrammingworld@gmail.com",
        name: "Neatly",
      },
      html: expect.stringContaining(
        "https://neatly.example/verify-email?token=abc",
      ),
      subject: "Welcome to Neatly — verify your email",
      text: expect.stringContaining("Verify Email"),
      to: "customer@neatly.example",
    });
    expect(
      JSON.stringify(vi.mocked(transport.sendMail).mock.calls),
    ).not.toContain("api.brevo.com");
  });

  it("sends cleaner invitations through the same SMTP transport", async (): Promise<void> => {
    const transport = createTransport();
    const service = new EmailService(
      new SmtpEmailProvider(config, (): SmtpTransport => transport),
    );

    await service.sendCleanerInvitationEmail({
      activateUrl: "https://neatly.example/cleaner/activate?token=abc",
      expiresInDays: 7,
      name: "Mia Cleaner",
      to: "mia@neatly.example",
    });

    expect(transport.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: {
          address: "sayamprogrammingworld@gmail.com",
          name: "Neatly",
        },
        subject: "Welcome to Neatly — activate your cleaner account",
        to: "mia@neatly.example",
      }),
    );
  });

  it("sends password-reset mail through the same SMTP transport", async (): Promise<void> => {
    const transport = createTransport();
    const service = new EmailService(
      new SmtpEmailProvider(config, (): SmtpTransport => transport),
    );

    await service.sendPasswordResetEmail({
      resetUrl: "https://neatly.example/reset-password?token=abc",
      to: "customer@neatly.example",
    });

    expect(transport.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: "Reset your Neatly password",
        to: "customer@neatly.example",
      }),
    );
  });

  it("classifies SMTP authentication failures", async (): Promise<void> => {
    const transport = createTransport({
      sendMail: vi
        .fn()
        .mockRejectedValue(
          Object.assign(new Error("Invalid login"), { code: "EAUTH" }),
        ),
    });
    const provider = new SmtpEmailProvider(
      config,
      (): SmtpTransport => transport,
    );

    await expect(
      provider.sendEmail({
        html: "<p>Test</p>",
        subject: "Neatly email connection test",
        text: "Test",
        to: "ops@neatly.example",
      }),
    ).rejects.toThrow("Transactional email dispatch failed.");

    expect(logError).toHaveBeenCalledWith(
      "Email provider request failed",
      expect.objectContaining({
        host: SMTP_DEFAULT_HOST,
        kind: "authentication",
        provider: "smtp",
      }),
    );
    expect(JSON.stringify(vi.mocked(logError).mock.calls)).not.toContain(
      PASSWORD,
    );
  });

  it("classifies SMTP connection failures", async (): Promise<void> => {
    const transport = createTransport({
      sendMail: vi.fn().mockRejectedValue(
        Object.assign(new Error("connect ECONNREFUSED"), {
          code: "ECONNECTION",
        }),
      ),
    });
    const provider = new SmtpEmailProvider(
      config,
      (): SmtpTransport => transport,
    );

    await expect(
      provider.sendEmail({
        html: "<p>Test</p>",
        subject: "Neatly email connection test",
        text: "Test",
        to: "ops@neatly.example",
      }),
    ).rejects.toThrow("Transactional email dispatch failed.");

    expect(logError).toHaveBeenCalledWith(
      "Email provider request failed",
      expect.objectContaining({
        kind: "connection",
      }),
    );
  });

  it("verifies the SMTP connection without sending mail", async (): Promise<void> => {
    const transport = createTransport();
    const provider = new SmtpEmailProvider(
      config,
      (): SmtpTransport => transport,
    );

    await provider.verifyConnection();

    expect(transport.verify).toHaveBeenCalledTimes(1);
    expect(transport.sendMail).not.toHaveBeenCalled();
  });
});

describe("UnconfiguredEmailProvider", (): void => {
  it("fails email operations instead of reporting a console success", async (): Promise<void> => {
    const provider = new UnconfiguredEmailProvider();

    await expect(
      provider.sendEmail({
        html: "<p>Test</p>",
        subject: "Welcome to Neatly — activate your cleaner account",
        text: "Test",
        to: "ops@neatly.example",
      }),
    ).rejects.toThrow("Transactional email is not configured.");

    expect(logError).toHaveBeenCalledWith(
      "Email provider request failed",
      expect.objectContaining({
        kind: "not_configured",
        provider: "smtp",
      }),
    );
  });
});

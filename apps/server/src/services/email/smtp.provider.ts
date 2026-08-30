import nodemailer from "nodemailer";
import { SMTP_SECURE_PORT } from "../../config/constants.ts";
import type { SmtpEnv } from "../../config/env.ts";
import { logError, logInfo } from "../../lib/logger.ts";
import type { EmailMessage, EmailProvider } from "./provider.ts";

export interface SmtpTransport {
  sendMail(mail: {
    from: { address: string; name: string };
    html: string;
    subject: string;
    text: string;
    to: string;
  }): Promise<{ messageId?: string }>;
  verify(): Promise<boolean>;
}

export type SmtpTransportFactory = (config: SmtpEnv) => SmtpTransport;

export class SmtpEmailProvider implements EmailProvider {
  private readonly config: SmtpEnv;
  private readonly transport: SmtpTransport;

  public constructor(
    config: SmtpEnv,
    createTransport: SmtpTransportFactory = createNodemailerTransport,
  ) {
    this.config = config;
    this.transport = createTransport(config);
  }

  public async verifyConnection(): Promise<void> {
    try {
      await this.transport.verify();
      logInfo("Transactional email provider", {
        host: this.config.host,
        port: this.config.port,
        provider: "smtp",
        verified: true,
      });
    } catch (error: unknown) {
      logSmtpFailure("SMTP connection failed", error, this.config);
      throw new Error("Transactional email dispatch failed.");
    }
  }

  public async sendEmail(message: EmailMessage): Promise<void> {
    try {
      await this.transport.sendMail({
        from: {
          address: this.config.fromEmail,
          name: this.config.fromName,
        },
        html: message.html,
        subject: message.subject,
        text: message.text,
        to: message.to,
      });
      logInfo("Email accepted by SMTP server", {
        host: this.config.host,
        provider: "smtp",
      });
    } catch (error: unknown) {
      logSmtpFailure("Email provider request failed", error, this.config);
      throw new Error("Transactional email dispatch failed.");
    }
  }
}

export class UnconfiguredEmailProvider implements EmailProvider {
  public async sendEmail(_message: EmailMessage): Promise<void> {
    logError("Email provider request failed", {
      kind: "not_configured",
      provider: "smtp",
    });
    throw new Error("Transactional email is not configured.");
  }

  public async verifyConnection(): Promise<void> {
    logError("SMTP connection failed", {
      kind: "not_configured",
      provider: "smtp",
    });
    throw new Error("Transactional email is not configured.");
  }
}

export function createNodemailerTransport(config: SmtpEnv): SmtpTransport {
  return nodemailer.createTransport({
    auth: {
      pass: config.password,
      user: config.user,
    },
    host: config.host,
    port: config.port,
    secure: config.port === SMTP_SECURE_PORT,
  });
}

function logSmtpFailure(
  message: string,
  error: unknown,
  config: SmtpEnv,
): void {
  logError(message, {
    host: config.host,
    kind: classifySmtpFailure(error),
    port: config.port,
    provider: "smtp",
  });
}

function classifySmtpFailure(error: unknown): string {
  const code = readErrorCode(error);
  const text = readErrorText(error).toLowerCase();

  if (
    code === "EAUTH" ||
    text.includes("invalid login") ||
    text.includes("authentication")
  ) {
    return "authentication";
  }

  if (
    code === "ETIMEDOUT" ||
    code === "ESOCKETTIMEDOUT" ||
    text.includes("timeout")
  ) {
    return "timeout";
  }

  if (
    code === "ECONNECTION" ||
    code === "EDNS" ||
    code === "ECONNREFUSED" ||
    text.includes("connect")
  ) {
    return "connection";
  }

  if (
    code === "ESTARTTLS" ||
    text.includes("starttls") ||
    text.includes("tls") ||
    text.includes("certificate")
  ) {
    return "tls";
  }

  if (text.includes("sender") || text.includes("from address")) {
    return "sender_rejected";
  }

  if (
    text.includes("recipient") ||
    text.includes("mailbox") ||
    code === "EENVELOPE"
  ) {
    return "invalid_recipient";
  }

  return "provider_error";
}

function readErrorCode(error: unknown): string | undefined {
  if (typeof error !== "object" || error === null || !("code" in error)) {
    return undefined;
  }

  return typeof error.code === "string" ? error.code : undefined;
}

function readErrorText(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "";
}

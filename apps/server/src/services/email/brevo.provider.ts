import { logError } from "../../lib/logger.ts";
import type {
  EmailProvider,
  PasswordResetEmailInput,
  VerificationEmailInput,
} from "./provider.ts";

const BREVO_SMTP_URL = "https://api.brevo.com/v3/smtp/email";

export interface BrevoEmailConfig {
  apiKey: string;
  fromEmail: string;
  fromName: string;
}

export class BrevoEmailProvider implements EmailProvider {
  private readonly config: BrevoEmailConfig;

  public constructor(config: BrevoEmailConfig) {
    this.config = config;
  }

  public async sendPasswordResetEmail(
    input: PasswordResetEmailInput,
  ): Promise<void> {
    await this.send({
      htmlContent: `<p>Reset your Neatly password using this link:</p><p><a href="${escapeHtml(input.resetUrl)}">${escapeHtml(input.resetUrl)}</a></p>`,
      subject: "Reset your Neatly password",
      textContent: `Reset your Neatly password: ${input.resetUrl}`,
      to: input.to,
    });
  }

  public async sendVerificationEmail(
    input: VerificationEmailInput,
  ): Promise<void> {
    await this.send({
      htmlContent: `<p>Verify your Neatly email using this link:</p><p><a href="${escapeHtml(input.verifyUrl)}">${escapeHtml(input.verifyUrl)}</a></p>`,
      subject: "Verify your Neatly email",
      textContent: `Verify your Neatly email: ${input.verifyUrl}`,
      to: input.to,
    });
  }

  private async send(input: {
    htmlContent: string;
    subject: string;
    textContent: string;
    to: string;
  }): Promise<void> {
    const response = await fetch(BREVO_SMTP_URL, {
      body: JSON.stringify({
        htmlContent: input.htmlContent,
        sender: {
          email: this.config.fromEmail,
          name: this.config.fromName,
        },
        subject: input.subject,
        textContent: input.textContent,
        to: [{ email: input.to }],
      }),
      headers: {
        accept: "application/json",
        "api-key": this.config.apiKey,
        "content-type": "application/json",
      },
      method: "POST",
    });

    if (!response.ok) {
      logError("Transactional email dispatch failed", {
        status: response.status,
      });
      throw new Error("Transactional email dispatch failed.");
    }
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

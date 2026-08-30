import { logError } from "../../lib/logger.ts";
import type {
  CleanerInvitationEmailInput,
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

  public async sendCleanerInvitationEmail(
    input: CleanerInvitationEmailInput,
  ): Promise<void> {
    const name = escapeHtml(input.name);
    const email = escapeHtml(input.to);
    const activateUrl = escapeHtml(input.activateUrl);
    const days = String(input.expiresInDays);

    await this.send({
      htmlContent: `<p>Welcome to Neatly, ${name}.</p><p>Your Cleaner account has been created by the Neatly team.</p><p>Email: ${email}</p><p><a href="${activateUrl}">Activate Account</a></p><p>This invitation expires after ${days} days.</p>`,
      subject: "Welcome to Neatly — activate your cleaner account",
      textContent: `Welcome to Neatly, ${input.name}. Your Cleaner account has been created by the Neatly team. Email: ${input.to}. Activate your account: ${input.activateUrl}. This invitation expires after ${days} days.`,
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

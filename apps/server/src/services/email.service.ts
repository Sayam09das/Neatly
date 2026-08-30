import type {
  CleanerInvitationEmailInput,
  EmailMessage,
  EmailProvider,
  PasswordResetEmailInput,
  VerificationEmailInput,
} from "./email/provider.ts";

const TEST_EMAIL_SUBJECT = "Neatly email connection test";
const TEST_EMAIL_TEXT = "Neatly transactional email is connected.";

export class EmailService {
  private readonly provider: EmailProvider;

  public constructor(provider: EmailProvider) {
    this.provider = provider;
  }

  public async sendEmail(message: EmailMessage): Promise<void> {
    await this.provider.sendEmail(message);
  }

  public async sendPasswordResetEmail(
    input: PasswordResetEmailInput,
  ): Promise<void> {
    await this.provider.sendEmail({
      html: `<p>Reset your Neatly password using this link:</p><p><a href="${escapeHtml(input.resetUrl)}">${escapeHtml(input.resetUrl)}</a></p>`,
      resetUrl: input.resetUrl,
      subject: "Reset your Neatly password",
      text: `Reset your Neatly password: ${input.resetUrl}`,
      to: input.to,
    });
  }

  public async sendVerificationEmail(
    input: VerificationEmailInput,
  ): Promise<void> {
    await this.provider.sendEmail({
      html: `<p>Welcome to Neatly</p><p>Please verify your email address to activate your account.</p><p><a href="${escapeHtml(input.verifyUrl)}">Verify Email</a></p>`,
      subject: "Welcome to Neatly — verify your email",
      text: `Welcome to Neatly. Please verify your email address to activate your account. Verify Email: ${input.verifyUrl}`,
      to: input.to,
      verifyUrl: input.verifyUrl,
    });
  }

  public async sendCleanerInvitationEmail(
    input: CleanerInvitationEmailInput,
  ): Promise<void> {
    const name = escapeHtml(input.name);
    const email = escapeHtml(input.to);
    const activateUrl = escapeHtml(input.activateUrl);
    const days = String(input.expiresInDays);

    await this.provider.sendEmail({
      activateUrl: input.activateUrl,
      html: `<p>Welcome to Neatly, ${name}.</p><p>Your Cleaner account has been created by the Neatly team.</p><p>Email: ${email}</p><p><a href="${activateUrl}">Activate Account</a></p><p>This invitation expires after ${days} days.</p>`,
      recipientName: input.name,
      subject: "Welcome to Neatly — activate your cleaner account",
      text: `Welcome to Neatly, ${input.name}. Your Cleaner account has been created by the Neatly team. Email: ${input.to}. Activate your account: ${input.activateUrl}. This invitation expires after ${days} days.`,
      to: input.to,
    });
  }

  public async sendTestEmail(to: string): Promise<void> {
    await this.provider.sendEmail({
      html: `<p>${TEST_EMAIL_TEXT}</p>`,
      subject: TEST_EMAIL_SUBJECT,
      text: TEST_EMAIL_TEXT,
      to,
    });
  }

  public async verifyConnection(): Promise<void> {
    await this.provider.verifyConnection();
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export interface PasswordResetEmailInput {
  resetUrl: string;
  to: string;
}

export interface VerificationEmailInput {
  to: string;
  verifyUrl: string;
}

export interface CleanerInvitationEmailInput {
  activateUrl: string;
  expiresInDays: number;
  name: string;
  to: string;
}

export interface EmailMessage {
  activateUrl?: string;
  html: string;
  recipientName?: string;
  resetUrl?: string;
  subject: string;
  text: string;
  to: string;
  verifyUrl?: string;
}

export interface EmailProvider {
  sendEmail(message: EmailMessage): Promise<void>;
  verifyConnection(): Promise<void>;
}

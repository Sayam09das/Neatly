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

export interface EmailProvider {
  sendCleanerInvitationEmail(input: CleanerInvitationEmailInput): Promise<void>;
  sendPasswordResetEmail(input: PasswordResetEmailInput): Promise<void>;
  sendVerificationEmail(input: VerificationEmailInput): Promise<void>;
}

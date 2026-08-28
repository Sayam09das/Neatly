export interface PasswordResetEmailInput {
  resetUrl: string;
  to: string;
}

export interface VerificationEmailInput {
  to: string;
  verifyUrl: string;
}

export interface EmailProvider {
  sendPasswordResetEmail(input: PasswordResetEmailInput): Promise<void>;
  sendVerificationEmail(input: VerificationEmailInput): Promise<void>;
}

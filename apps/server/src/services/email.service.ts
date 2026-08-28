import type {
  EmailProvider,
  PasswordResetEmailInput,
  VerificationEmailInput,
} from "./email/provider.ts";

export class EmailService {
  private readonly provider: EmailProvider;

  public constructor(provider: EmailProvider) {
    this.provider = provider;
  }

  public async sendPasswordResetEmail(
    input: PasswordResetEmailInput,
  ): Promise<void> {
    await this.provider.sendPasswordResetEmail(input);
  }

  public async sendVerificationEmail(
    input: VerificationEmailInput,
  ): Promise<void> {
    await this.provider.sendVerificationEmail(input);
  }
}

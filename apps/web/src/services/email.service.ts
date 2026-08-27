import { ConsoleEmailProvider } from "@/services/email/console.provider";
import type {
  EmailProvider,
  PasswordResetEmailInput,
  VerificationEmailInput,
} from "@/services/email/provider";

export class EmailService {
  public constructor(
    private readonly provider: EmailProvider = new ConsoleEmailProvider(),
  ) {}

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

import { logAuthEvent } from "@/lib/auth/logger";
import type {
  EmailProvider,
  PasswordResetEmailInput,
  VerificationEmailInput,
} from "@/services/email/provider";

export class ConsoleEmailProvider implements EmailProvider {
  public async sendPasswordResetEmail(
    _input: PasswordResetEmailInput,
  ): Promise<void> {
    logAuthEvent({
      type: "password_reset_email_queued",
      outcome: "success",
    });
  }

  public async sendVerificationEmail(
    _input: VerificationEmailInput,
  ): Promise<void> {
    logAuthEvent({
      type: "verification_email_queued",
      outcome: "success",
    });
  }
}

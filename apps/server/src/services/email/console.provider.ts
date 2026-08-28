import { logAuthEvent } from "../../lib/auth/logger.ts";
import type {
  EmailProvider,
  PasswordResetEmailInput,
  VerificationEmailInput,
} from "./provider.ts";

export class ConsoleEmailProvider implements EmailProvider {
  public async sendPasswordResetEmail(
    _input: PasswordResetEmailInput,
  ): Promise<void> {
    logAuthEvent({
      outcome: "success",
      type: "password_reset_email_queued",
    });
  }

  public async sendVerificationEmail(
    _input: VerificationEmailInput,
  ): Promise<void> {
    logAuthEvent({
      outcome: "success",
      type: "verification_email_queued",
    });
  }
}

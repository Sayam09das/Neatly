import { loadAuthEnv } from "../../config/env.ts";
import { AuthService } from "../../services/auth.service.ts";
import { BrevoEmailProvider } from "../../services/email/brevo.provider.ts";
import { ConsoleEmailProvider } from "../../services/email/console.provider.ts";
import type { EmailProvider } from "../../services/email/provider.ts";
import { EmailService } from "../../services/email.service.ts";
import { PrismaAuthRepository } from "./prisma-repository.ts";

let authService: AuthService | undefined;

export function getAuthService(): AuthService {
  if (authService === undefined) {
    const env = loadAuthEnv();
    authService = new AuthService(
      new PrismaAuthRepository(),
      new EmailService(createEmailProvider(env.smtp)),
      env.sessionSecret,
      { siteUrl: env.siteUrl },
    );
  }

  return authService;
}

function createEmailProvider(
  smtp: ReturnType<typeof loadAuthEnv>["smtp"],
): EmailProvider {
  if (smtp === null) {
    return new ConsoleEmailProvider();
  }

  return new BrevoEmailProvider({
    apiKey: smtp.password,
    fromEmail: smtp.fromEmail,
    fromName: smtp.fromName,
  });
}

import { loadAuthEnv } from "../../config/env.ts";
import { AuthService } from "../../services/auth.service.ts";
import type { EmailProvider } from "../../services/email/provider.ts";
import {
  SmtpEmailProvider,
  UnconfiguredEmailProvider,
} from "../../services/email/smtp.provider.ts";
import { EmailService } from "../../services/email.service.ts";
import { logInfo } from "../logger.ts";
import { PrismaAuthRepository } from "./prisma-repository.ts";

let authService: AuthService | undefined;

export function getAuthService(): AuthService {
  if (authService === undefined) {
    const env = loadAuthEnv();
    authService = new AuthService(
      new PrismaAuthRepository(),
      new EmailService(createEmailProvider(env.email)),
      env.sessionSecret,
      { siteUrl: env.siteUrl },
    );
  }

  return authService;
}

function createEmailProvider(
  email: ReturnType<typeof loadAuthEnv>["email"],
): EmailProvider {
  if (email === null) {
    logInfo("Transactional email provider", {
      authConfigured: false,
      fromEmailConfigured: false,
      hostConfigured: false,
      provider: "smtp",
      userConfigured: false,
    });
    return new UnconfiguredEmailProvider();
  }

  logInfo("Transactional email provider", {
    authConfigured: true,
    fromEmail: email.fromEmail,
    fromEmailConfigured: true,
    host: email.host,
    hostConfigured: true,
    port: email.port,
    provider: "smtp",
    userConfigured: true,
  });
  return new SmtpEmailProvider(email);
}

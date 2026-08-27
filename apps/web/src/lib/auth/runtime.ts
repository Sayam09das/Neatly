import { loadServerEnv } from "@neatly/config/server";
import { PrismaAuthRepository } from "@/lib/auth/prisma-repository";
import { AuthService } from "@/services/auth.service";
import { EmailService } from "@/services/email.service";

let authService: AuthService | undefined;

export function getAuthService(): AuthService {
  if (authService === undefined) {
    const env = loadServerEnv();
    authService = new AuthService(
      new PrismaAuthRepository(),
      new EmailService(),
      env.SESSION_SECRET,
      { siteUrl: env.NEXT_PUBLIC_SITE_URL },
    );
  }

  return authService;
}

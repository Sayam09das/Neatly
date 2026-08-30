import { loadAuthEnv } from "../src/config/env.ts";
import { SmtpEmailProvider } from "../src/services/email/smtp.provider.ts";
import { EmailService } from "../src/services/email.service.ts";

const env = loadAuthEnv();

if (env.email === null) {
  console.log(
    JSON.stringify({
      reason: "smtp_not_configured",
      sent: false,
      verified: false,
    }),
  );
  process.exit(1);
}

const service = new EmailService(new SmtpEmailProvider(env.email));

try {
  await service.verifyConnection();
} catch {
  console.log(
    JSON.stringify({
      reason: "smtp_verify_failed",
      sent: false,
      verified: false,
    }),
  );
  process.exit(1);
}

const recipient = process.argv[2] ?? env.email.fromEmail;

try {
  await service.sendTestEmail(recipient);
} catch {
  console.log(
    JSON.stringify({
      reason: "smtp_send_failed",
      sent: false,
      verified: true,
    }),
  );
  process.exit(1);
}

console.log(
  JSON.stringify({
    reason: null,
    sent: true,
    to: recipient,
    verified: true,
  }),
);

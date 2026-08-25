import { z } from "zod";
import {
  type EnvSource,
  EnvValidationError,
  invalidVariableMessage,
  missingVariableMessage,
  readEnvValue,
} from "./env";

const SITE_URL_META = {
  required: true,
  visibility: "client-safe",
  expected: "a public URL",
} as const;

const clientEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z
    .string({
      error: missingVariableMessage("NEXT_PUBLIC_SITE_URL", SITE_URL_META),
    })
    .url({
      error: invalidVariableMessage("NEXT_PUBLIC_SITE_URL", SITE_URL_META),
    }),
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;

export function loadClientEnv(source: EnvSource = process.env): ClientEnv {
  const raw = {
    NEXT_PUBLIC_SITE_URL: readEnvValue(source, "NEXT_PUBLIC_SITE_URL"),
  };
  const result = clientEnvSchema.safeParse(raw);

  if (!result.success) {
    const messages = result.error.issues.map((issue): string => issue.message);
    throw new EnvValidationError(messages, ["NEXT_PUBLIC_SITE_URL"]);
  }

  return result.data;
}

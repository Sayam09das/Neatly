import { z } from "zod";
import {
  type EnvSource,
  EnvValidationError,
  invalidVariableMessage,
  missingVariableMessage,
  readEnvValue,
} from "./env";

const SESSION_SECRET_MIN_LENGTH = 32;

const DATABASE_URL_META = {
  required: true,
  visibility: "server-only",
  expected: "a PostgreSQL connection URL",
} as const;

const SESSION_SECRET_META = {
  required: true,
  visibility: "server-only",
  expected: `a secret at least ${String(SESSION_SECRET_MIN_LENGTH)} characters`,
} as const;

const EMAIL_API_KEY_META = {
  required: true,
  visibility: "server-only",
  expected: "an email provider API key",
} as const;

const STORAGE_API_KEY_META = {
  required: true,
  visibility: "server-only",
  expected: "a storage provider API key",
} as const;

const SITE_URL_META = {
  required: true,
  visibility: "client-safe",
  expected: "a public URL",
} as const;

const serverEnvSchema = z.object({
  DATABASE_URL: z
    .string({
      error: missingVariableMessage("DATABASE_URL", DATABASE_URL_META),
    })
    .url({
      error: invalidVariableMessage("DATABASE_URL", DATABASE_URL_META),
    }),
  SESSION_SECRET: z
    .string({
      error: missingVariableMessage("SESSION_SECRET", SESSION_SECRET_META),
    })
    .min(SESSION_SECRET_MIN_LENGTH, {
      error: invalidVariableMessage("SESSION_SECRET", SESSION_SECRET_META),
    }),
  EMAIL_API_KEY: z.string({
    error: missingVariableMessage("EMAIL_API_KEY", EMAIL_API_KEY_META),
  }),
  STORAGE_API_KEY: z.string({
    error: missingVariableMessage("STORAGE_API_KEY", STORAGE_API_KEY_META),
  }),
  NEXT_PUBLIC_SITE_URL: z
    .string({
      error: missingVariableMessage("NEXT_PUBLIC_SITE_URL", SITE_URL_META),
    })
    .url({
      error: invalidVariableMessage("NEXT_PUBLIC_SITE_URL", SITE_URL_META),
    }),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

function isBrowserRuntime(): boolean {
  return (
    Reflect.has(globalThis, "window") &&
    Reflect.get(globalThis, "window") !== undefined
  );
}

function assertServerRuntime(): void {
  if (isBrowserRuntime()) {
    throw new Error(
      "Server environment configuration cannot be imported in client code. Import @neatly/config/server only on the server.",
    );
  }
}

export function loadServerEnv(source: EnvSource = process.env): ServerEnv {
  assertServerRuntime();

  const raw = {
    DATABASE_URL: readEnvValue(source, "DATABASE_URL"),
    SESSION_SECRET: readEnvValue(source, "SESSION_SECRET"),
    EMAIL_API_KEY: readEnvValue(source, "EMAIL_API_KEY"),
    STORAGE_API_KEY: readEnvValue(source, "STORAGE_API_KEY"),
    NEXT_PUBLIC_SITE_URL: readEnvValue(source, "NEXT_PUBLIC_SITE_URL"),
  };
  const result = serverEnvSchema.safeParse(raw);

  if (!result.success) {
    const messages = result.error.issues.map((issue): string => issue.message);
    const variableNames = result.error.issues.map((issue): string =>
      String(issue.path[0] ?? "UNKNOWN"),
    );
    throw new EnvValidationError(messages, variableNames);
  }

  return result.data;
}

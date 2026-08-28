import { z } from "zod";
import {
  type EnvSource,
  EnvValidationError,
  invalidVariableMessage,
  missingVariableMessage,
  readEnvValue,
} from "./env";

const API_URL_META = {
  required: true,
  visibility: "server-only",
  expected: "the Neatly HTTP API origin",
} as const;

const SITE_URL_META = {
  required: true,
  visibility: "client-safe",
  expected: "a public URL",
} as const;

const serverEnvSchema = z.object({
  NEATLY_API_URL: z
    .string({
      error: missingVariableMessage("NEATLY_API_URL", API_URL_META),
    })
    .url({
      error: invalidVariableMessage("NEATLY_API_URL", API_URL_META),
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
    NEATLY_API_URL: readEnvValue(source, "NEATLY_API_URL"),
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

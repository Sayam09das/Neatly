import { AUTH_SESSION_SECRET_MIN_LENGTH } from "./auth.ts";
import {
  API_DEFAULT_HOST,
  API_DEFAULT_PORT,
  SMTP_DEFAULT_PORT,
  SUPABASE_SERVICES_THUMB_BUCKET_DEFAULT,
} from "./constants.ts";

export type ApiNodeEnv = "development" | "production" | "test";

export interface SmtpEnv {
  fromEmail: string;
  fromName: string;
  host: string;
  password: string;
  port: number;
  user: string;
}

export interface AuthEnv {
  email: SmtpEnv | null;
  sessionSecret: string;
  siteUrl: string;
}

export interface ApiEnv {
  corsOrigin: string | null;
  host: string;
  nodeEnv: ApiNodeEnv;
  port: number;
}

export interface StorageEnv {
  serviceRoleKey: string;
  servicesThumbBucket: string;
  supabaseUrl: string;
}

const PORT_MIN = 1;
const PORT_MAX = 65535;

export function loadApiEnv(
  source: Record<string, string | undefined> = process.env,
): ApiEnv {
  return {
    corsOrigin: readOptionalOrigin(
      source.CORS_ORIGIN ?? source.SITE_URL ?? source.NEXT_PUBLIC_SITE_URL,
    ),
    host: readHost(source.HOST),
    nodeEnv: readNodeEnv(source.NODE_ENV),
    port: readPort(source.PORT),
  };
}

export function loadStorageEnv(
  source: Record<string, string | undefined> = process.env,
): StorageEnv | null {
  const supabaseUrl = readEnvValue(source.SUPABASE_URL);
  const serviceRoleKey = readEnvValue(source.SUPABASE_SECRET_KEY);
  const servicesThumbBucket =
    readEnvValue(source.SUPABASE_SERVICES_THUMB_BUCKET) ??
    SUPABASE_SERVICES_THUMB_BUCKET_DEFAULT;

  if (supabaseUrl === undefined || serviceRoleKey === undefined) {
    return null;
  }

  try {
    return {
      serviceRoleKey,
      servicesThumbBucket,
      supabaseUrl: new URL(supabaseUrl).origin,
    };
  } catch {
    return null;
  }
}

export function loadAuthEnv(
  source: Record<string, string | undefined> = process.env,
): AuthEnv {
  return {
    email: readSmtp(source, false),
    sessionSecret: readSessionSecret(source.SESSION_SECRET),
    siteUrl: readSiteUrl(source.SITE_URL ?? source.NEXT_PUBLIC_SITE_URL),
  };
}

export function isProductionEnv(nodeEnv: ApiNodeEnv): boolean {
  return nodeEnv === "production";
}

export function assertProductionConfig(
  source: Record<string, string | undefined> = process.env,
): void {
  const env = loadApiEnv(source);

  if (!isProductionEnv(env.nodeEnv)) {
    return;
  }

  const databaseUrl = source.DATABASE_URL?.trim();

  if (databaseUrl === undefined || databaseUrl === "") {
    throw new Error("DATABASE_URL is required.");
  }

  loadAuthEnv(source);
  readSmtp(source, true);
}

function readHost(value: string | undefined): string {
  const trimmed = value?.trim();
  return trimmed === undefined || trimmed === "" ? API_DEFAULT_HOST : trimmed;
}

function readNodeEnv(value: string | undefined): ApiNodeEnv {
  if (value === "production" || value === "test" || value === "development") {
    return value;
  }

  return "development";
}

function readPort(value: string | undefined): number {
  const trimmed = value?.trim();

  if (trimmed === undefined || trimmed === "") {
    return API_DEFAULT_PORT;
  }

  const port = Number.parseInt(trimmed, 10);

  if (!Number.isInteger(port) || port < PORT_MIN || port > PORT_MAX) {
    throw new Error(
      `PORT is invalid. Expected an integer between ${String(PORT_MIN)} and ${String(PORT_MAX)}.`,
    );
  }

  return port;
}

function readSessionSecret(value: string | undefined): string {
  const trimmed = value?.trim();

  if (trimmed === undefined || trimmed === "") {
    throw new Error(
      `SESSION_SECRET is required. Expected a secret at least ${String(AUTH_SESSION_SECRET_MIN_LENGTH)} characters.`,
    );
  }

  if (trimmed.length < AUTH_SESSION_SECRET_MIN_LENGTH) {
    throw new Error(
      `SESSION_SECRET is invalid. Expected a secret at least ${String(AUTH_SESSION_SECRET_MIN_LENGTH)} characters.`,
    );
  }

  return trimmed;
}

function readSiteUrl(value: string | undefined): string {
  const trimmed = value?.trim();

  if (trimmed === undefined || trimmed === "") {
    throw new Error("SITE_URL is required. Expected a public URL.");
  }

  try {
    return new URL(trimmed).origin;
  } catch {
    throw new Error("SITE_URL is invalid. Expected a public URL.");
  }
}

function readOptionalOrigin(value: string | undefined): string | null {
  const trimmed = value?.trim();

  if (trimmed === undefined || trimmed === "") {
    return null;
  }

  try {
    return new URL(trimmed).origin;
  } catch {
    throw new Error("CORS_ORIGIN is invalid. Expected a public URL.");
  }
}

function readEnvValue(value: string | undefined): string | undefined {
  const trimmed = value?.trim();

  if (trimmed === undefined || trimmed === "") {
    return undefined;
  }

  const quoted =
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"));

  if (!quoted) {
    return trimmed;
  }

  const unquoted = trimmed.slice(1, -1).trim();
  return unquoted === "" ? undefined : unquoted;
}

function readSmtp(
  source: Record<string, string | undefined>,
  required: boolean,
): SmtpEnv | null {
  const host = readEnvValue(source.SMTP_HOST);
  const port = readSmtpPort(source.SMTP_PORT, required);
  const user = readEnvValue(source.SMTP_USER);
  const password = readEnvValue(source.SMTP_PASSWORD);
  const fromEmail = readEnvValue(source.SMTP_FROM_EMAIL);
  const fromName = readEnvValue(source.SMTP_FROM_NAME);

  if (required) {
    if (host === undefined) {
      throw new Error("SMTP_HOST is missing");
    }

    if (port === null) {
      throw new Error("SMTP_PORT is invalid");
    }

    if (user === undefined) {
      throw new Error("SMTP_USER is missing");
    }

    if (password === undefined) {
      throw new Error("SMTP_PASSWORD is missing");
    }

    if (fromEmail === undefined) {
      throw new Error("SMTP_FROM_EMAIL is missing");
    }

    if (fromName === undefined) {
      throw new Error("SMTP_FROM_NAME is missing");
    }

    return {
      fromEmail,
      fromName,
      host,
      password,
      port,
      user,
    };
  }

  if (
    host === undefined ||
    port === null ||
    user === undefined ||
    password === undefined ||
    fromEmail === undefined ||
    fromName === undefined
  ) {
    return null;
  }

  return {
    fromEmail,
    fromName,
    host,
    password,
    port,
    user,
  };
}

function readSmtpPort(
  value: string | undefined,
  required: boolean,
): number | null {
  const trimmed = readEnvValue(value);

  if (trimmed === undefined) {
    return SMTP_DEFAULT_PORT;
  }

  const port = Number.parseInt(trimmed, 10);

  if (!Number.isInteger(port) || port < PORT_MIN || port > PORT_MAX) {
    if (required) {
      throw new Error(
        `SMTP_PORT is invalid. Expected an integer between ${String(PORT_MIN)} and ${String(PORT_MAX)}.`,
      );
    }

    return null;
  }

  return port;
}

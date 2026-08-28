import { AUTH_SESSION_SECRET_MIN_LENGTH } from "./auth.ts";
import { API_DEFAULT_HOST, API_DEFAULT_PORT } from "./constants.ts";

export type ApiNodeEnv = "development" | "production" | "test";

export interface SmtpEnv {
  fromEmail: string;
  fromName: string;
  password: string;
}

export interface AuthEnv {
  sessionSecret: string;
  siteUrl: string;
  smtp: SmtpEnv | null;
}

export interface ApiEnv {
  corsOrigin: string | null;
  host: string;
  nodeEnv: ApiNodeEnv;
  port: number;
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

export function loadAuthEnv(
  source: Record<string, string | undefined> = process.env,
): AuthEnv {
  return {
    sessionSecret: readSessionSecret(source.SESSION_SECRET),
    siteUrl: readSiteUrl(source.SITE_URL ?? source.NEXT_PUBLIC_SITE_URL),
    smtp: readSmtp(source),
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

  loadAuthEnv(source);

  const databaseUrl = source.DATABASE_URL?.trim();

  if (databaseUrl === undefined || databaseUrl === "") {
    throw new Error("DATABASE_URL is required.");
  }
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

function readSmtp(source: Record<string, string | undefined>): SmtpEnv | null {
  const fromEmail = source.SMTP_FROM_EMAIL?.trim();
  const fromName = source.SMTP_FROM_NAME?.trim();
  const password = source.SMTP_PASSWORD?.trim();

  if (
    fromEmail === undefined ||
    fromEmail === "" ||
    fromName === undefined ||
    fromName === "" ||
    password === undefined ||
    password === ""
  ) {
    return null;
  }

  return {
    fromEmail,
    fromName,
    password,
  };
}

import { API_DEFAULT_HOST, API_DEFAULT_PORT } from "./constants.ts";

export type ApiNodeEnv = "development" | "production" | "test";

export interface ApiEnv {
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
    host: readHost(source.HOST),
    nodeEnv: readNodeEnv(source.NODE_ENV),
    port: readPort(source.PORT),
  };
}

export function isProductionEnv(nodeEnv: ApiNodeEnv): boolean {
  return nodeEnv === "production";
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

import type { IncomingMessage } from "node:http";
import { AUTH_SESSION_TOKEN_HEADER } from "../../config/auth.ts";
import { AuthError } from "./errors.ts";

const JSON_BODY_LIMIT_BYTES = 32_768;

export async function readJsonBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  let size = 0;

  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;

    if (size > JSON_BODY_LIMIT_BYTES) {
      throw new AuthError("INVALID_INPUT", "Validation failed.", [
        { field: "body", issue: "Request body is too large." },
      ]);
    }

    chunks.push(buffer);
  }

  if (chunks.length === 0) {
    throw new AuthError("INVALID_INPUT", "Validation failed.", [
      { field: "body", issue: "Request body must be valid JSON." },
    ]);
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown;
  } catch {
    throw new AuthError("INVALID_INPUT", "Validation failed.", [
      { field: "body", issue: "Request body must be valid JSON." },
    ]);
  }
}

export function getRequestIp(req: IncomingMessage): string {
  const forwarded = headerValue(req.headers["x-forwarded-for"]);

  if (forwarded !== undefined) {
    const [first] = forwarded.split(",");
    const ip = first?.trim();

    if (ip !== undefined && ip !== "") {
      return ip;
    }
  }

  return req.socket.remoteAddress ?? "unknown";
}

export function getSessionToken(req: IncomingMessage): string | undefined {
  const bearer = headerValue(req.headers.authorization);

  if (bearer !== undefined) {
    const normalized = bearer.toLowerCase();

    if (normalized.startsWith("bearer ")) {
      const token = bearer.slice("bearer ".length).trim();
      return token === "" ? undefined : token;
    }
  }

  const headerToken = headerValue(req.headers[AUTH_SESSION_TOKEN_HEADER]);
  return headerToken === "" ? undefined : headerToken;
}

function headerValue(
  value: Array<string> | string | undefined,
): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  const resolved = Array.isArray(value) ? value[0] : value;
  const trimmed = resolved?.trim();
  return trimmed === undefined || trimmed === "" ? undefined : trimmed;
}

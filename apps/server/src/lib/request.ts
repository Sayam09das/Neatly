import type { IncomingMessage } from "node:http";
import {
  API_JSON_BODY_LIMIT_BYTES,
  API_REQUEST_ID_HEADER,
  API_REQUEST_ID_MAX_LENGTH,
} from "../config/constants.ts";
import { createUnsupportedMediaTypeError, ValidationError } from "./errors.ts";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function getHeader(
  req: IncomingMessage,
  name: string,
): string | undefined {
  const value = req.headers[name];

  if (value === undefined) {
    return undefined;
  }

  const resolved = Array.isArray(value) ? value[0] : value;
  const trimmed = resolved?.trim();
  return trimmed === undefined || trimmed === "" ? undefined : trimmed;
}

export function readTrustedRequestId(req: IncomingMessage): string | undefined {
  const value = getHeader(req, API_REQUEST_ID_HEADER);

  if (value === undefined) {
    return undefined;
  }

  if (value.length > API_REQUEST_ID_MAX_LENGTH) {
    return undefined;
  }

  if (!UUID_PATTERN.test(value)) {
    return undefined;
  }

  return value.toLowerCase();
}

export function getRequestIp(req: IncomingMessage): string {
  const forwarded = getHeader(req, "x-forwarded-for");

  if (forwarded !== undefined) {
    const [first] = forwarded.split(",");
    const ip = first?.trim();

    if (ip !== undefined && ip !== "") {
      return ip;
    }
  }

  return req.socket.remoteAddress ?? "unknown";
}

export function requireJsonContentType(req: IncomingMessage): void {
  const contentType = getHeader(req, "content-type");

  if (
    contentType === undefined ||
    !contentType.toLowerCase().startsWith("application/json")
  ) {
    throw createUnsupportedMediaTypeError();
  }
}

export async function readJsonBody(
  req: IncomingMessage,
  limitBytes: number = API_JSON_BODY_LIMIT_BYTES,
): Promise<unknown> {
  requireJsonContentType(req);

  const chunks: Buffer[] = [];
  let size = 0;

  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;

    if (size > limitBytes) {
      throw new ValidationError("Validation failed.", [
        { field: "body", issue: "Request body is too large." },
      ]);
    }

    chunks.push(buffer);
  }

  if (chunks.length === 0) {
    throw new ValidationError("Validation failed.", [
      { field: "body", issue: "Request body must be valid JSON." },
    ]);
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown;
  } catch {
    throw new ValidationError("Validation failed.", [
      { field: "body", issue: "Request body must be valid JSON." },
    ]);
  }
}

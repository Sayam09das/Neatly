import type { IncomingMessage } from "node:http";
import { MEDIA_UPLOAD_MAX_BYTES } from "../config/constants.ts";
import { createUnsupportedMediaTypeError, ValidationError } from "./errors.ts";
import { getHeader } from "./request.ts";

export interface UploadedFormFile {
  body: Buffer;
  filename: string;
  mimeType: string;
}

export interface MediaUploadForm {
  altText: string;
  file: UploadedFormFile;
}

const MULTIPART_OVERHEAD_BYTES = 8_192;

export async function readMediaUploadForm(
  req: IncomingMessage,
): Promise<MediaUploadForm> {
  const contentType = getHeader(req, "content-type") ?? "";
  const boundary = readBoundary(contentType);

  if (boundary === null) {
    throw createUnsupportedMediaTypeError();
  }

  const raw = await readRequestBytes(
    req,
    MEDIA_UPLOAD_MAX_BYTES + MULTIPART_OVERHEAD_BYTES,
  );
  const parts = splitMultipart(raw, boundary);
  let file: UploadedFormFile | null = null;
  let altText = "";

  for (const part of parts) {
    if (part.name === "altText") {
      altText = part.body.toString("utf8").trim();
      continue;
    }

    if (part.name === "file" && part.filename !== undefined) {
      file = {
        body: part.body,
        filename: part.filename,
        mimeType: part.mimeType ?? "application/octet-stream",
      };
    }
  }

  if (file === null) {
    throw new ValidationError("Validation failed.", [
      { field: "file", issue: "Choose a thumbnail image." },
    ]);
  }

  return { altText, file };
}

function readBoundary(contentType: string): string | null {
  const match = /boundary=([^;]+)/i.exec(contentType);

  if (
    match === null ||
    !contentType.toLowerCase().startsWith("multipart/form-data")
  ) {
    return null;
  }

  return match[1]?.trim().replaceAll(/^"|"$/g, "") ?? null;
}

async function readRequestBytes(
  req: IncomingMessage,
  limitBytes: number,
): Promise<Buffer> {
  const chunks: Buffer[] = [];
  let size = 0;

  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;

    if (size > limitBytes) {
      throw new ValidationError("Validation failed.", [
        { field: "file", issue: "Use a JPEG, PNG, or WebP image up to 5MB." },
      ]);
    }

    chunks.push(buffer);
  }

  return Buffer.concat(chunks);
}

function splitMultipart(
  raw: Buffer,
  boundary: string,
): readonly {
  body: Buffer;
  filename?: string;
  mimeType?: string;
  name: string;
}[] {
  const delimiter = Buffer.from(`--${boundary}`);
  const parts: {
    body: Buffer;
    filename?: string;
    mimeType?: string;
    name: string;
  }[] = [];
  let offset = raw.indexOf(delimiter);

  while (offset !== -1) {
    const start = offset + delimiter.length;

    if (raw.subarray(start, start + 2).toString("ascii") === "--") {
      break;
    }

    const next = raw.indexOf(delimiter, start);

    if (next === -1) {
      break;
    }

    const part = raw.subarray(start, next);
    const parsed = parsePart(part);

    if (parsed !== null) {
      parts.push(parsed);
    }

    offset = next;
  }

  return parts;
}

function parsePart(part: Buffer): {
  body: Buffer;
  filename?: string;
  mimeType?: string;
  name: string;
} | null {
  const headerEnd = part.indexOf("\r\n\r\n");

  if (headerEnd === -1) {
    return null;
  }

  const headers = part.subarray(0, headerEnd).toString("utf8");
  let body = part.subarray(headerEnd + 4);

  if (body.subarray(-2).toString("ascii") === "\r\n") {
    body = body.subarray(0, -2);
  }

  const disposition =
    /content-disposition:\s*form-data;([^;\r\n]*(?:;[^\r\n]*)*)/i.exec(headers);

  if (disposition === null) {
    return null;
  }

  const name = /name="([^"]+)"/i.exec(disposition[1] ?? "")?.[1];

  if (name === undefined) {
    return null;
  }

  const filename = /filename="([^"]+)"/i.exec(disposition[1] ?? "")?.[1];
  const mimeType = /content-type:\s*([^\r\n]+)/i.exec(headers)?.[1]?.trim();

  return { body, filename, mimeType, name };
}

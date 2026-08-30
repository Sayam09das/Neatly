import { createHash, randomUUID } from "node:crypto";
import {
  type MEDIA_ALLOWED_MIME_TYPES,
  MEDIA_UPLOAD_MAX_BYTES,
} from "../../config/constants.ts";
import { ValidationError } from "../../lib/errors.ts";
import type { MediaRepository } from "../../repositories/media.repository.ts";
import type { StorageProvider } from "../storage/provider.ts";
import type {
  MediaRecord,
  RegisterExternalMediaInput,
  UploadMediaInput,
} from "./media.types.ts";

const MIME_EXTENSIONS: Record<
  (typeof MEDIA_ALLOWED_MIME_TYPES)[number],
  string
> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export class MediaService {
  private readonly media: MediaRepository;
  private readonly storage: StorageProvider | null;

  public constructor(media: MediaRepository, storage: StorageProvider | null) {
    this.media = media;
    this.storage = storage;
  }

  public async findById(id: string): Promise<MediaRecord | null> {
    return this.media.findById(id);
  }

  public async uploadThumbnail(input: UploadMediaInput): Promise<MediaRecord> {
    if (this.storage === null) {
      throw new ValidationError("Image storage is not configured.");
    }

    const mimeType = requireAllowedMime(input.mimeType, input.body);

    if (
      input.body.byteLength === 0 ||
      input.body.byteLength > MEDIA_UPLOAD_MAX_BYTES
    ) {
      throw new ValidationError("Validation failed.", [
        {
          field: "file",
          issue: "Use a JPEG, PNG, or WebP image up to 5MB.",
        },
      ]);
    }

    const extension = MIME_EXTENSIONS[mimeType];
    const storageKey = `services/${randomUUID()}.${extension}`;
    const stored = await this.storage.uploadObject({
      body: input.body,
      contentType: mimeType,
      storageKey,
    });

    return this.media.create({
      altText: requireAltText(input.altText),
      filename: sanitizeFilename(input.filename, extension),
      mimeType,
      size: input.body.byteLength,
      storageKey: stored.storageKey,
      url: stored.url,
    });
  }

  public async registerExternalImage(
    input: RegisterExternalMediaInput,
  ): Promise<MediaRecord> {
    const url = requireHttpsImageUrl(input.url);
    const storageKey = `external/${createHash("sha256").update(url).digest("hex")}`;
    const existing = await this.media.findByStorageKey(storageKey);

    if (existing !== null) {
      return existing;
    }

    const filename = filenameFromUrl(url);

    return this.media.create({
      altText: requireAltText(input.altText),
      filename,
      mimeType: mimeFromFilename(filename),
      size: 0,
      storageKey,
      url,
    });
  }
}

function requireAllowedMime(
  declared: string,
  body: Buffer,
): (typeof MEDIA_ALLOWED_MIME_TYPES)[number] {
  const sniff = sniffImageMime(body);
  const normalized = declared.trim().toLowerCase();

  const declaredAllowed =
    normalized === "" ||
    normalized === "application/octet-stream" ||
    normalized === sniff ||
    (normalized === "image/jpg" && sniff === "image/jpeg");

  if (sniff === undefined || !declaredAllowed) {
    throw new ValidationError("Validation failed.", [
      {
        field: "file",
        issue: "Use a JPEG, PNG, or WebP image up to 5MB.",
      },
    ]);
  }

  return sniff;
}

function sniffImageMime(
  body: Buffer,
): (typeof MEDIA_ALLOWED_MIME_TYPES)[number] | undefined {
  if (
    body.length >= 3 &&
    body[0] === 0xff &&
    body[1] === 0xd8 &&
    body[2] === 0xff
  ) {
    return "image/jpeg";
  }

  if (
    body.length >= 8 &&
    body[0] === 0x89 &&
    body[1] === 0x50 &&
    body[2] === 0x4e &&
    body[3] === 0x47
  ) {
    return "image/png";
  }

  if (
    body.length >= 12 &&
    body.subarray(0, 4).toString("ascii") === "RIFF" &&
    body.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return "image/webp";
  }

  return undefined;
}

function requireHttpsImageUrl(value: string): string {
  try {
    const url = new URL(value.trim());

    if (url.protocol !== "https:") {
      throw new Error("invalid");
    }

    return url.toString();
  } catch {
    throw new ValidationError("Validation failed.", [
      { field: "coverImageUrl", issue: "Enter a valid HTTPS image URL." },
    ]);
  }
}

function requireAltText(value: string): string {
  const trimmed = value.trim();
  return trimmed === "" ? "Service thumbnail" : trimmed;
}

function sanitizeFilename(filename: string, extension: string): string {
  const base = filename
    .trim()
    .replaceAll(/[^a-zA-Z0-9._-]/g, "-")
    .replaceAll(/-+/g, "-")
    .slice(0, 80);

  if (base === "") {
    return `thumbnail.${extension}`;
  }

  return base;
}

function filenameFromUrl(url: string): string {
  const name = new URL(url).pathname.split("/").pop() ?? "thumbnail.jpg";
  return sanitizeFilename(name, "jpg");
}

function mimeFromFilename(
  filename: string,
): (typeof MEDIA_ALLOWED_MIME_TYPES)[number] {
  const lower = filename.toLowerCase();

  if (lower.endsWith(".png")) {
    return "image/png";
  }

  if (lower.endsWith(".webp")) {
    return "image/webp";
  }

  return "image/jpeg";
}

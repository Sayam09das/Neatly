import type { StorageEnv } from "../../config/env.ts";
import { logError } from "../../lib/logger.ts";
import type {
  StorageObjectInput,
  StorageProvider,
  StoredObject,
} from "./provider.ts";

export class SupabaseStorageProvider implements StorageProvider {
  private readonly config: StorageEnv;

  public constructor(config: StorageEnv) {
    this.config = config;
  }

  public async uploadObject(input: StorageObjectInput): Promise<StoredObject> {
    const path = `${this.config.supabaseUrl}/storage/v1/object/${encodeURIComponent(this.config.servicesThumbBucket)}/${encodeStoragePath(input.storageKey)}`;
    let response: Response;

    try {
      response = await fetch(path, {
        body: new Uint8Array(input.body),
        headers: {
          apikey: this.config.serviceRoleKey,
          authorization: `Bearer ${this.config.serviceRoleKey}`,
          "cache-control": "3600",
          "content-type": input.contentType,
          "x-upsert": "true",
        },
        method: "POST",
      });
    } catch {
      logError("Storage upload failed", { kind: "network" });
      throw new Error("Storage upload failed.");
    }

    if (!response.ok) {
      logError("Storage upload failed", {
        kind: "provider_error",
        status: response.status,
      });
      throw new Error("Storage upload failed.");
    }

    return {
      storageKey: input.storageKey,
      url: publicObjectUrl(
        this.config.supabaseUrl,
        this.config.servicesThumbBucket,
        input.storageKey,
      ),
    };
  }
}

function publicObjectUrl(
  supabaseUrl: string,
  bucket: string,
  storageKey: string,
): string {
  return `${supabaseUrl}/storage/v1/object/public/${encodeURIComponent(bucket)}/${encodeStoragePath(storageKey)}`;
}

function encodeStoragePath(storageKey: string): string {
  return storageKey
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

import { describe, expect, it, vi } from "vitest";
import { ValidationError } from "../../../apps/server/src/lib/errors.ts";
import type { MediaRepository } from "../../../apps/server/src/repositories/media.repository.ts";
import { MediaService } from "../../../apps/server/src/services/media/media.service.ts";
import type {
  CreateMediaInput,
  MediaRecord,
} from "../../../apps/server/src/services/media/media.types.ts";
import type { StorageProvider } from "../../../apps/server/src/services/storage/provider.ts";

const JPEG = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);

class MemoryMediaRepository implements MediaRepository {
  private readonly rows = new Map<string, MediaRecord>();

  public async create(input: CreateMediaInput): Promise<MediaRecord> {
    const row: MediaRecord = {
      ...input,
      id: `media-${String(this.rows.size + 1)}`,
    };
    this.rows.set(row.id, row);
    return row;
  }

  public async findById(id: string): Promise<MediaRecord | null> {
    return this.rows.get(id) ?? null;
  }

  public async findByStorageKey(
    storageKey: string,
  ): Promise<MediaRecord | null> {
    return (
      [...this.rows.values()].find((row) => row.storageKey === storageKey) ??
      null
    );
  }
}

describe("MediaService", (): void => {
  it("uploads a JPEG thumbnail through storage and stores metadata", async (): Promise<void> => {
    const storage: StorageProvider = {
      uploadObject: vi.fn().mockImplementation(async (input) => ({
        storageKey: input.storageKey,
        url: `https://example.supabase.co/storage/v1/object/public/Services_Thumb/${input.storageKey}`,
      })),
    };
    const service = new MediaService(new MemoryMediaRepository(), storage);
    const media = await service.uploadThumbnail({
      altText: "Kitchen refresh",
      body: JPEG,
      filename: "kitchen.jpg",
      mimeType: "image/jpeg",
    });

    expect(media.mimeType).toBe("image/jpeg");
    expect(media.altText).toBe("Kitchen refresh");
    expect(media.url).toContain("Services_Thumb");
    expect(storage.uploadObject).toHaveBeenCalledTimes(1);
  });

  it("registers an HTTPS thumbnail link without uploading bytes", async (): Promise<void> => {
    const storage: StorageProvider = {
      uploadObject: vi.fn(),
    };
    const service = new MediaService(new MemoryMediaRepository(), storage);
    const media = await service.registerExternalImage({
      altText: "Linked cover",
      url: "https://cdn.example.com/covers/kitchen.jpg",
    });

    expect(media.url).toBe("https://cdn.example.com/covers/kitchen.jpg");
    expect(storage.uploadObject).not.toHaveBeenCalled();
  });

  it("rejects uploads when storage is not configured", async (): Promise<void> => {
    const service = new MediaService(new MemoryMediaRepository(), null);

    await expect(
      service.uploadThumbnail({
        altText: "Kitchen",
        body: JPEG,
        filename: "kitchen.jpg",
        mimeType: "image/jpeg",
      }),
    ).rejects.toBeInstanceOf(ValidationError);
  });
});

import { prisma } from "../lib/db.ts";
import type {
  CreateMediaInput,
  MediaRecord,
} from "../services/media/media.types.ts";

export interface MediaRepository {
  create(input: CreateMediaInput): Promise<MediaRecord>;
  findById(id: string): Promise<MediaRecord | null>;
  findByStorageKey(storageKey: string): Promise<MediaRecord | null>;
}

export class PrismaMediaRepository implements MediaRepository {
  public async create(input: CreateMediaInput): Promise<MediaRecord> {
    const row = await prisma.mediaAsset.create({
      data: {
        altText: input.altText,
        filename: input.filename,
        mimeType: input.mimeType,
        size: input.size,
        storageKey: input.storageKey,
        url: input.url,
      },
    });
    return toRecord(row);
  }

  public async findById(id: string): Promise<MediaRecord | null> {
    const row = await prisma.mediaAsset.findUnique({ where: { id } });
    return row === null ? null : toRecord(row);
  }

  public async findByStorageKey(
    storageKey: string,
  ): Promise<MediaRecord | null> {
    const row = await prisma.mediaAsset.findUnique({ where: { storageKey } });
    return row === null ? null : toRecord(row);
  }
}

function toRecord(row: {
  altText: string;
  filename: string;
  id: string;
  mimeType: string;
  size: number;
  storageKey: string;
  url: string;
}): MediaRecord {
  return {
    altText: row.altText,
    filename: row.filename,
    id: row.id,
    mimeType: row.mimeType,
    size: row.size,
    storageKey: row.storageKey,
    url: row.url,
  };
}

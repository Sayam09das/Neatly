export interface MediaRecord {
  altText: string;
  filename: string;
  id: string;
  mimeType: string;
  size: number;
  storageKey: string;
  url: string;
}

export interface CreateMediaInput {
  altText: string;
  filename: string;
  mimeType: string;
  size: number;
  storageKey: string;
  url: string;
}

export interface UploadMediaInput {
  altText: string;
  body: Buffer;
  filename: string;
  mimeType: string;
}

export interface RegisterExternalMediaInput {
  altText: string;
  url: string;
}

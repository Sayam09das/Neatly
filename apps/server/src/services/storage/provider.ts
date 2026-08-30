export interface StoredObject {
  storageKey: string;
  url: string;
}

export interface StorageObjectInput {
  body: Buffer;
  contentType: string;
  storageKey: string;
}

export interface StorageProvider {
  uploadObject(input: StorageObjectInput): Promise<StoredObject>;
}

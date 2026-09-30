/**
 * PABLO Media Storage Architecture & Provider Interface
 */

export interface MediaUploadParams {
  filename: string;
  mimeType: string;
  data: Buffer | Uint8Array;
  folder?: string;
  altText?: string;
  tags?: string[];
}

export interface MediaUploadResult {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  provider: "local" | "s3" | "r2";
  key: string;
}

export interface MediaFileMetadata {
  key: string;
  sizeBytes: number;
  mimeType: string;
  lastModified: string;
  etag?: string;
}

export interface IMediaStorageProvider {
  upload(params: MediaUploadParams): Promise<MediaUploadResult>;
  delete(key: string): Promise<boolean>;
  getUrl(key: string): string;
  getMetadata(key: string): Promise<MediaFileMetadata | null>;
}

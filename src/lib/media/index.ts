/**
 * PABLO Media Storage Architecture Factory & Exports
 */
import { IMediaStorageProvider } from "./types";
import { localMediaStorageProvider } from "./localProvider";
import { s3MediaStorageProvider } from "./s3Provider";

export * from "./types";
export * from "./localProvider";
export * from "./s3Provider";

export function getMediaStorageProvider(): IMediaStorageProvider {
  const provider = (process.env.MEDIA_PROVIDER || "local").toLowerCase();

  switch (provider) {
    case "s3":
    case "r2":
      return s3MediaStorageProvider;
    case "local":
    default:
      return localMediaStorageProvider;
  }
}

export const mediaStorageProvider = getMediaStorageProvider();

import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  NotFound,
  PutObjectCommand,
  S3,
} from "@aws-sdk/client-s3";
import { createReadStream } from "node:fs";
import { rm, writeFile } from "node:fs/promises";
import { Readable } from "node:stream";
import path from "path";

export function createSafeKey(
  cacheKey: string,
  bucketPathPrefix?: string | null,
): string {
  const encodedCacheKey = encodeURIComponent(cacheKey);
  return bucketPathPrefix
    ? path.join(bucketPathPrefix, encodedCacheKey)
    : encodedCacheKey;
}

export class FileNotFoundError extends Error {}

export type SpacesConfig = {
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  bucketPathPrefix: string | null;
};

export function createConfig(
  endpoint: string,
  accessKeyId: string,
  secretAccessKey: string,
  bucket: string,
  bucketPathPrefix: string | null = null,
): SpacesConfig {
  return {
    endpoint,
    accessKeyId,
    secretAccessKey,
    bucket,
    bucketPathPrefix,
  };
}

export type SpacesClient = S3;

export function createClient(config: SpacesConfig): SpacesClient {
  return new S3({
    endpoint: config.endpoint,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    region: "auto",
  });
}

export async function doesExist(
  client: SpacesClient,
  config: SpacesConfig,
  key: string,
) {
  try {
    await client.send(
      new HeadObjectCommand({
        Bucket: config.bucket,
        Key: key,
      }),
    );
    return true;
  } catch (error) {
    if (error instanceof NotFound) {
      return false;
    } else {
      throw error;
    }
  }
}

export async function downloadFile(
  client: SpacesClient,
  config: SpacesConfig,
  key: string,
  filePath: string,
) {
  const object = await client.send(
    new GetObjectCommand({
      Bucket: config.bucket,
      Key: key,
    }),
  );
  if (object.Body === undefined) {
    throw new FileNotFoundError();
  } else if (object.Body instanceof Readable) {
    await writeFile(filePath, object.Body);
  } else {
    throw new Error("Invalid spaces response body");
  }
}

export async function uploadFile(
  client: SpacesClient,
  config: SpacesConfig,
  key: string,
  filePath: string,
) {
  const fileStream = createReadStream(filePath);
  try {
    await client.send(
      new PutObjectCommand({
        Bucket: config.bucket,
        Key: key,
        Body: fileStream,
      }),
    );
  } finally {
    fileStream.close();
  }
}

export async function moveFile(
  client: SpacesClient,
  config: SpacesConfig,
  sourceKey: string,
  targetKey: string,
) {
  // CopyObjectCommand doesn't seem to work :(
  const filePath = "spaces-cache.tmp";
  await downloadFile(client, config, sourceKey, filePath);
  await uploadFile(client, config, targetKey, filePath);
  await rm(filePath);
  await deleteFile(client, config, sourceKey);
}

export async function deleteFile(
  client: SpacesClient,
  config: SpacesConfig,
  key: string,
) {
  await client.send(
    new DeleteObjectCommand({
      Bucket: config.bucket,
      Key: key,
    }),
  );
}

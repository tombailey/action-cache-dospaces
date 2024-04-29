import { SaveInputs } from "../job";
import { createTarFile } from "../tar";
import { createClient, createSafeKey, uploadFile } from "../spaces";
import untildify from "untildify";
import * as fs from "node:fs";

export async function save(
  inputs: SaveInputs,
  cacheArchiveFile = "action-cache-dospaces.tar.gz",
) {
  console.time("Creating tar file");
  await createTarFile(
    inputs.paths
      .map((filePath) => {
        return filePath.startsWith("~") ? untildify(filePath) : filePath;
      })
      .filter((filePath) => {
        return fs.existsSync(filePath);
      }),
    cacheArchiveFile,
    inputs.gzip,
  );
  console.timeEnd("Creating tar file");

  console.time("Uploading file");
  await uploadFile(
    createClient(inputs.config),
    inputs.config,
    createSafeKey(inputs.saveKey, inputs.config.bucketPathPrefix),
    cacheArchiveFile,
  );
  console.timeEnd("Uploading file");
}

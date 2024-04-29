import { SaveInputs } from "../job";
import { createTarFile } from "../tar";
import { createClient, createSafeKey, uploadFile } from "../spaces";
import untildify from "untildify";
import * as fs from "node:fs";

export async function save(
  inputs: SaveInputs,
  cacheArchiveFile = "action-cache-dospaces.tar.gz",
) {
  await createTarFile(
    inputs.paths
      .map((filePath) => {
        return filePath.startsWith("~") ? untildify(filePath) : filePath;
      })
      .filter((filePath) => {
        return fs.existsSync(filePath);
      }),
    cacheArchiveFile,
  );
  await uploadFile(
    createClient(inputs.config),
    inputs.config,
    createSafeKey(inputs.saveKey, inputs.config.bucketPathPrefix),
    cacheArchiveFile,
  );
}

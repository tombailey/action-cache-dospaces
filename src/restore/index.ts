import { RestoreInputs } from "../job";
import { extractTarFile } from "../tar";
import { createClient, createSafeKey, doesExist, downloadFile, SpacesClient, SpacesConfig, } from "../spaces";

export async function findFirstExistingCacheKey(
  client: SpacesClient,
  config: SpacesConfig,
  restoreKeys: string[],
): Promise<string | null> {
  for (const restoreKey of restoreKeys) {
    if (await doesExist(client, config, restoreKey)) {
      return restoreKey;
    }
  }
  return null;
}

export async function restore(
  inputs: RestoreInputs,
  cacheArchiveFile = "action-cache-dospaces.tar.gz",
) {
  const safeKeyToRestoreKey = Object.fromEntries(
    inputs.restoreKeys.map((restoreKey) => {
      return [
        createSafeKey(restoreKey, inputs.config.bucketPathPrefix),
        restoreKey,
      ];
    }),
  );

  const client = createClient(inputs.config);
  const relevantSafeKey = await findFirstExistingCacheKey(
    client,
    inputs.config,
    Object.keys(safeKeyToRestoreKey),
  );
  if (relevantSafeKey) {
    console.log(
      `Restoring cache with key ${safeKeyToRestoreKey[relevantSafeKey]}`,
    );

    console.timeEnd("Downloading file");
    await downloadFile(
      createClient(inputs.config),
      inputs.config,
      relevantSafeKey,
      cacheArchiveFile,
    );
    console.timeEnd("Downloading file");

    console.time("Extracting tar file");
    await extractTarFile(cacheArchiveFile, process.cwd());
    console.timeEnd("Extracting tar file");
  } else {
    console.warn("No relevant cache to restore");
  }
}

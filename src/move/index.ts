import { MoveInputs } from "../job";
import { createClient, createSafeKey, doesExist, moveFile } from "../spaces";

export async function move(inputs: MoveInputs) {
  const sourceKey = createSafeKey(
    inputs.sourceKey,
    inputs.config.bucketPathPrefix,
  );
  const client = createClient(inputs.config);
  if (await doesExist(client, inputs.config, sourceKey)) {
    const targetKey = createSafeKey(
      inputs.targetKey,
      inputs.config.bucketPathPrefix,
    );
    await moveFile(
      createClient(inputs.config),
      inputs.config,
      sourceKey,
      targetKey,
    );
  } else {
    throw new Error(`No cache with key '${inputs.sourceKey}'.`);
  }
}

import * as core from "@actions/core";
import { createConfig, SpacesConfig } from "./spaces";

export type CommonInputs = {
  config: SpacesConfig;
};

export function getCommonInputs(): CommonInputs {
  const config = createConfig(
    getRequiredInput("endpoint"),
    getRequiredInput("accessKeyId"),
    getRequiredInput("secretAccessKey"),
    getRequiredInput("bucket"),
    getOptionalInput("bucketPathPrefix"),
  );
  return {
    config,
  };
}

export type RestoreInputs = CommonInputs & {
  restoreKeys: string[];
};

export const restoreKeys = "restoreKeys";

export function getRestoreInputs(): RestoreInputs {
  return {
    ...getCommonInputs(),
    restoreKeys: getRequiredInput(restoreKeys).split("\n"),
  };
}

export type SaveInputs = CommonInputs & {
  saveKey: string;
  paths: string[];
  gzip: boolean;
};

export const saveKey = "saveKey";
export const gzipCache = "gzipCache";

export function getSaveInputs(): SaveInputs {
  const paths = getRequiredInput("paths").split("\n");
  return {
    ...getCommonInputs(),
    paths,
    saveKey: getRequiredInput(saveKey),
    gzip: getOptionalInput(gzipCache)?.toLowerCase() === "true",
  };
}

export type MoveInputs = CommonInputs & {
  sourceKey: string;
  targetKey: string;
};

export const sourceKey = "sourceKey";
export const targetKey = "targetKey";

export function getMoveInputs(): MoveInputs {
  return {
    ...getCommonInputs(),
    sourceKey: getRequiredInput(sourceKey),
    targetKey: getRequiredInput(targetKey),
  };
}

export function getOptionalInput(name: string) {
  const input = core.getInput(name, { required: false });
  return input.length === 0 ? null : input;
}

export function getRequiredInput(name: string) {
  return core.getInput(name, { required: true });
}

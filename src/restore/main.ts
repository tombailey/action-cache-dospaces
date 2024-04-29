import { getOptionalInput, getRestoreInputs, restoreKeys } from "../job";
import * as core from "@actions/core";
import { restore } from "./index";

export async function run() {
  try {
    await restore(getRestoreInputs());
  } catch (error) {
    console.error(error);
    core.setFailed(error instanceof Error ? error : "Unknown error");
  }
}

if (getOptionalInput(restoreKeys)) {
  run();
} else {
  console.warn("Nothing to restore");
}

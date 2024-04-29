import { getOptionalInput, getSaveInputs, saveKey } from "../job";
import { save } from "./index";
import * as core from "@actions/core";

export async function run() {
  try {
    const inputs = getSaveInputs();
    await save(inputs);
  } catch (error) {
    console.error(error);
    core.setFailed(error instanceof Error ? error : "Unknown error");
  }
}

if (getOptionalInput(saveKey)) {
  run();
} else {
  console.warn("Nothing to save");
}

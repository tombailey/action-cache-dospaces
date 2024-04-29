import { getMoveInputs } from "../job";
import * as core from "@actions/core";
import { move } from ".";

export async function run() {
  try {
    await move(getMoveInputs());
  } catch (error) {
    console.error(error);
    core.setFailed(error instanceof Error ? error : "Unknown error");
  }
}

run();

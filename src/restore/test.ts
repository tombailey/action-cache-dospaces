import { restore } from ".";
import { RestoreInputs } from "../job";

const inputs: RestoreInputs = {
  restoreKeys: ["patch/my-branch", "develop", "main"],
  config: {
    endpoint: process.env["SPACES_ENDPOINT"] ?? "",
    accessKeyId: process.env["SPACES_ACCESS_KEY_ID"] ?? "",
    secretAccessKey: process.env["SPACES_SECRET_ACCESS_KEY"] ?? "",
    bucket: process.env["SPACES_BUCKET"] ?? "",
    bucketPathPrefix: "local-test",
  },
};
restore(inputs).then(() => console.log("Done restoring"));

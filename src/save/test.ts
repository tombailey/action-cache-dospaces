import { save } from ".";
import { SaveInputs } from "../job";

const inputs: SaveInputs = {
  saveKey: "develop",
  config: {
    endpoint: process.env["SPACES_ENDPOINT"] ?? "",
    accessKeyId: process.env["SPACES_ACCESS_KEY_ID"] ?? "",
    secretAccessKey: process.env["SPACES_SECRET_ACCESS_KEY"] ?? "",
    bucket: process.env["SPACES_BUCKET"] ?? "",
    bucketPathPrefix: "local-test",
  },
  paths: [
    "~/test_file.txt",
    "~/test_dir",
    "/app/test_file.txt",
    "/app/test_dir",
    "/app/missing",
  ],
  gzip: false,
};
save(inputs).then(() => console.log("Done saving"));

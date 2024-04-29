import { move } from ".";
import { MoveInputs } from "../job";

const inputs: MoveInputs = {
  config: {
    endpoint: process.env["SPACES_ENDPOINT"] ?? "",
    accessKeyId: process.env["SPACES_ACCESS_KEY_ID"] ?? "",
    secretAccessKey: process.env["SPACES_SECRET_ACCESS_KEY"] ?? "",
    bucket: process.env["SPACES_BUCKET"] ?? "",
    bucketPathPrefix: "local-test",
  },
  sourceKey: "develop",
  targetKey: "main",
};
move(inputs).then(() => console.log("Done moving"));

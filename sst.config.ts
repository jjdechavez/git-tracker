import { SSTConfig } from "sst";
import { ApiStack } from "./stacks/api";
import { WebStack } from "./stacks/web";
import { AuthStack } from "./stacks/auth";

export default {
  config(_input) {
    return {
      name: "git-tracker",
      region: "ap-southeast-1",
    };
  },
  stacks(app) {
    app.stack(ApiStack).stack(WebStack).stack(AuthStack);
  },
} satisfies SSTConfig;

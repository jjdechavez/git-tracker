import { SSTConfig } from "sst";
import { ApiStack } from "./stacks/ApiStack";

export default {
  config(_input) {
    return {
      name: "git-tracker",
      region: "ap-southeast-1",
    };
  },
  stacks(app) {
    app.stack(ApiStack);
  },
} satisfies SSTConfig;

import { StackContext, StaticSite, use } from "sst/constructs";
import { ApiStack } from "./api";

export function WebStack({ stack }: StackContext) {
  const { api } = use(ApiStack);

  const site = new StaticSite(stack, "web", {
    path: "packages/web",
    buildCommand: "pnpm build",
    buildOutput: "dist",
    environment: {
      VITE_APP_API_URL: api.url,
    },
  });

  stack.addOutputs({
    SiteURL: site.url,
  });

  return {
    site,
  };
}

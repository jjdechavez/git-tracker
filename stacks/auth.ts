import { StackContext, Auth, use } from "sst/constructs";
import { ApiStack } from "./api";
import { WebStack } from "./web";

export function AuthStack({ stack }: StackContext) {
  const { api } = use(ApiStack);
  const { site } = use(WebStack);

  const auth = new Auth(stack, "auth", {
    authenticator: {
      handler: "packages/functions/src/auth.handler",
      bind: [site],
    },
  });

  auth.attach(stack, {
    api,
    prefix: "/auth",
  });

  return {
    auth,
  };
}

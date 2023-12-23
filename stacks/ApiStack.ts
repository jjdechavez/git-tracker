import { StackContext, Api, Config } from "sst/constructs";

export function ApiStack({ stack }: StackContext) {
  const secrets = Config.Secret.create(
    stack,
    // "DATABASE_URL",
    // "DATABASE_AUTH_TOKEN",
    "GITHUB_CLIENT_ID",
    "GITHUB_CLIENT_SECRET"
  );

  const api = new Api(stack, "api", {
    defaults: {
      function: {
        bind: [secrets.GITHUB_CLIENT_ID, secrets.GITHUB_CLIENT_SECRET],
      },
    },
    routes: {
      "GET /": "packages/functions/src/lambda.handler",
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  return {
    api,
  };
}

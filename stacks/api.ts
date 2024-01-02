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
        nodejs: {
          esbuild: {
            external: ["better-sqlite3"],
          },
        },
      },
    },
    routes: {
      "GET /": "packages/functions/src/lambda.handler",
      "GET /migration/latest": {
        function: {
          handler: "packages/functions/src/migrator.latest",
          description: "Migrate to latest on db",
        },
      },
      "GET /session": {
        function: {
          handler: "packages/functions/src/auth.session",
          description: "Get user by token",
        },
      },
      "POST /projects": {
        function: {
          handler: "packages/functions/src/project.create",
          description: "Create project",
        },
      },
      "GET /projects": {
        function: {
          handler: "packages/functions/src/project.list",
          description: "List of projects",
        },
      },
      "GET /projects/{slug}": {
        function: {
          handler: "packages/functions/src/project.slug",
          description: "Get project by slug",
        },
      },
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  return {
    api,
  };
}

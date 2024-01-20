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
      "POST /projects/{slug}/platforms": {
        function: {
          handler: "packages/functions/src/platform.create",
          description: "Create platform from project",
        },
      },
      "GET /platforms": {
        function: {
          handler: "packages/functions/src/platform.list",
          description: "List platforms",
        },
      },
      "GET /platforms/{slug}": {
        function: {
          handler: "packages/functions/src/platform.slug",
          description: "Get platform by slug",
        },
      },
      "POST /tickets": {
        function: {
          handler: "packages/functions/src/ticket.create",
          description: "Create ticket",
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

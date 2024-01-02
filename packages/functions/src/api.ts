import { ApiHandler, Response } from "sst/node/api";
import { useSession } from "sst/node/auth";
import {
  Context,
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";

export const withApiAuth = (
  cb: (
    evt: APIGatewayProxyEventV2,
    ctx: Context
  ) => Promise<void | APIGatewayProxyStructuredResultV2>
) =>
  ApiHandler((event: APIGatewayProxyEventV2, context: Context) => {
    const session = useSession();

    if (session.type !== "user") {
      throw new Response({
        statusCode: 401,
        body: "Unauthorized",
      });
    }

    return cb(event, context);
  });

export class BadRequestResponse extends Response {
  constructor(message: string) {
    super({
      statusCode: 400,
      body: message,
    });
  }
}

export class UnauthorizedResponse extends Response {
  constructor(message: string = "Unauthorized") {
    super({
      statusCode: 401,
      body: message,
    });
  }
}

export class NotFoundResponse extends Response {
  constructor(message: string) {
    super({
      statusCode: 404,
      body: message,
    });
  }
}

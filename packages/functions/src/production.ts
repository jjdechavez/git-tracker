import { useJsonBody, usePathParam, useQueryParam, useQueryParams } from "sst/node/api";
import { useSession } from "sst/node/auth";
import { Production } from "@git-tracker/core/production";
import { Platform } from "@git-tracker/core/platform";
import { Project } from "@git-tracker/core/project";
import {
  BadRequestResponse,
  NotFoundResponse,
  UnauthorizedResponse,
  withApiAuth,
} from "./api";

export const create = withApiAuth(async () => {
  const body = useJsonBody();

  if (!body) {
    throw new BadRequestResponse("Missing body");
  }

  const session = useSession();
  if (session.type !== "user") {
    throw new UnauthorizedResponse();
  }

  const sessionId = session.properties.userID;

  const project = await Project.findById(body.projectId, {
    creator_id: sessionId,
  });

  if (!project) {
    throw new BadRequestResponse(`Project not found with ${body.projectId}`);
  }

  const platform = await Platform.findById(body.platformId, {
    creator_id: sessionId,
  });

  if (!platform) {
    throw new BadRequestResponse(`Platform not found with ${body.platformId}`);
  }

  const validateSchema = Production.createSchema.safeParse({
    project_id: project.id,
    pushed_date: body.pushedDate,
    platform_id: platform.id,
    creator_id: Number(sessionId),
  });

  if (!validateSchema.success) {
    throw new BadRequestResponse(validateSchema.error.message);
  }

  const production = await Production.create(validateSchema.data);

  return {
    statusCode: 201,
    body: JSON.stringify(production),
  };
});

export const list = withApiAuth(async (_evt) => {
  const session = useSession();

  if (session.type !== "user") {
    throw new UnauthorizedResponse();
  }

  const queryParams = useQueryParams();

  const productions = await Production.list(session.properties.userID, queryParams);

  return {
    statusCode: 200,
    body: JSON.stringify({ data: productions }),
  };
});

export const findById = withApiAuth(async (_evt) => {
  const session = useSession();

  if (session.type !== "user") {
    throw new UnauthorizedResponse();
  }

  const productionId = usePathParam("productionId");

  if (!productionId) {
    throw new BadRequestResponse("Missing production ID");
  }

  const projectId = useQueryParam("projectId");

  if (!projectId) {
    throw new BadRequestResponse("Missing project ID");
  }

  const production = await Production.findById(productionId, {
    creator_id: session.properties.userID,
    project_id: projectId,
  });

  if (!production) {
    throw new NotFoundResponse(`Project not found with ${productionId} ID`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(production),
  };
});

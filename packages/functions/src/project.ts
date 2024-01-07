import { useJsonBody, usePathParam } from "sst/node/api";
import { useSession } from "sst/node/auth";
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

  const validateSchema = Project.createSchema.safeParse({
    name: body.name,
    creator_id: Number(session.properties.userID),
  });

  if (!validateSchema.success) {
    throw new BadRequestResponse(validateSchema.error.message);
  }

  const project = await Project.create(validateSchema.data);

  return {
    statusCode: 201,
    body: JSON.stringify(project),
  };
});

export const slug = withApiAuth(async (_evt) => {
  const slug = usePathParam("slug");

  if (!slug) {
    throw new BadRequestResponse("Missing slug");
  }

  const session = useSession();

  if (session.type !== "user") {
    throw new UnauthorizedResponse();
  }

  const sessionID = session.properties.userID;

  const project = await Project.findBySlug(slug, {
    creator_id: sessionID,
  });

  if (!project) {
    throw new NotFoundResponse(`Project not found with ${slug} slug`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(Project.serialize(project)),
  };
});

export const list = withApiAuth(async (_evt) => {
  const session = useSession();

  if (session.type !== "user") {
    throw new UnauthorizedResponse();
  }

  const projects = await Project.list(session.properties.userID, {});

  return {
    statusCode: 200,
    body: JSON.stringify({ data: projects.map(Project.serialize) }),
  };
});

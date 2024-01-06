import { useJsonBody, usePathParam } from "sst/node/api";
import { useSession } from "sst/node/auth";
import { Platform } from "@git-tracker/core/platform";
import {
  BadRequestResponse,
  NotFoundResponse,
  UnauthorizedResponse,
  withApiAuth,
} from "./api";
import { Project } from "@git-tracker/core/project";
import { ProjectStatuses } from "@git-tracker/core/project/project.sql";

// Create platform from project
// /projects/{slug}/platforms
export const create = withApiAuth(async () => {
  const projectSlug = usePathParam("slug");

  if (!projectSlug) {
    throw new BadRequestResponse("Missing project slug");
  }

  const body = useJsonBody();

  if (!body) {
    throw new BadRequestResponse("Missing body");
  }

  const session = useSession();

  if (session.type !== "user") {
    throw new UnauthorizedResponse();
  }

  const sessionId = session.properties.userID;

  const project = await Project.findBySlug(projectSlug, {
    creator_id: sessionId,
  });

  if (!project) {
    throw new NotFoundResponse(`Project not found with ${projectSlug} slug`);
  }

  if (project.status === ProjectStatuses.inactive) {
    throw new BadRequestResponse("Project is no longer available");
  }

  const validateSchema = Platform.createSchema.safeParse({
    name: body.name,
    creator_id: Number(sessionId),
    project_id: project.id,
    prefix_ticket: body.prefixTicket,
  });

  if (!validateSchema.success) {
    throw new BadRequestResponse(validateSchema.error.message);
  }

  const platform = await Platform.create(validateSchema.data);

  return {
    statusCode: 201,
    body: JSON.stringify(platform),
  };
});

// Find platform by slug
// /platforms/{slug}
export const slug = withApiAuth(async (_evt) => {
  const slug = usePathParam("slug");

  if (!slug) {
    throw new BadRequestResponse("Missing platform slug");
  }

  const session = useSession();

  if (session.type !== "user") {
    throw new UnauthorizedResponse();
  }

  const platform = await Platform.findBySlug(slug, {
    creator_id: session.properties.userID,
  });

  if (!platform) {
    throw new NotFoundResponse(`Platform not found with ${slug} slug`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(Platform.serialize(platform)),
  };
});

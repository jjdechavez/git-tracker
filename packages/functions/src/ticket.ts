import {
  useJsonBody,
  usePathParam,
  useQueryParam,
} from "sst/node/api";
import { useSession } from "sst/node/auth";
import { Ticket } from "@git-tracker/core/ticket";
import {
  BadRequestResponse,
  NotFoundResponse,
  UnauthorizedResponse,
  withApiAuth,
} from "./api";
import { Project } from "@git-tracker/core/project";

export const create = withApiAuth(async () => {
  const session = useSession();

  if (session.type !== "user") {
    throw new UnauthorizedResponse();
  }

  const body = useJsonBody();

  if (!body) {
    throw new BadRequestResponse("Missing body");
  }

  const project = await Project.findBySlug(body.projectSlug, {});

  if (!project) {
    throw new NotFoundResponse("Project not found by slug");
  }

  const validateSchema = Ticket.createSchema.safeParse({
    name: body.name,
    description: body.description,
    project_id: project.id,
    creator_id: Number(session.properties.userID),
  });

  if (!validateSchema.success) {
    throw new BadRequestResponse(validateSchema.error.message);
  }

  const ticket = await Ticket.create(validateSchema.data);

  return {
    statusCode: 201,
    body: JSON.stringify(ticket),
  };
});

export const list = withApiAuth(async (_evt) => {
  const session = useSession();

  if (session.type !== "user") {
    throw new UnauthorizedResponse();
  }

  const projectSlug = useQueryParam("projectSlug");

  if (!projectSlug) {
    throw new BadRequestResponse("Missing project slug query");
  }

  const project = await Project.findBySlug(projectSlug, {});

  if (!project) {
    throw new NotFoundResponse("Project not found by slug");
  }

  const search = useQueryParam("s");

  const tickets = await Ticket.list(session.properties.userID, {
    projectId: project.id,
    s: search,
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ data: tickets }),
  };
});

export const update = withApiAuth(async () => {
  const session = useSession();

  if (session.type !== "user") {
    throw new UnauthorizedResponse();
  }

  const ticketId = usePathParam("ticketId");

  if (!ticketId) {
    throw new BadRequestResponse("Missing ticket ID");
  }

  const body = useJsonBody();

  if (!body) {
    throw new BadRequestResponse("Missing body");
  }

  const ticketExists = await Ticket.list(session.properties.userID, {
    ticketIds: [ticketId],
  });

  if (ticketExists.length === 0) {
    throw new NotFoundResponse("Ticket not found");
  }

  const validateSchema = Ticket.updateSchema.safeParse({
    name: body.name,
    description: body.description,
  });

  if (!validateSchema.success) {
    throw new BadRequestResponse(validateSchema.error.message);
  }

  await Ticket.update(ticketId, validateSchema.data);

  return {
    statusCode: 204,
  };
});

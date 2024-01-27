import { useJsonBody, usePathParam } from "sst/node/api";
import { useSession } from "sst/node/auth";
import { Commit } from "@git-tracker/core/commit";
import {
  BadRequestResponse,
  NotFoundResponse,
  UnauthorizedResponse,
  withApiAuth,
} from "./api";
import { Ticket } from "@git-tracker/core/ticket";

export const create = withApiAuth(async () => {
  const session = useSession();

  if (session.type !== "user") {
    throw new UnauthorizedResponse();
  }

  const body = useJsonBody();

  if (!body) {
    throw new BadRequestResponse("Missing body");
  }

  const sessionId = session.properties.userID;

  const ticket = await Ticket.findById(body.ticketId, {
    creatorId: sessionId,
  });

  if (!ticket) {
    throw new NotFoundResponse(`Ticket not found with ${body.ticketId} id`);
  }

  const commitedAt = new Date(body.commitedAt);

  const validateSchema = Commit.createSchema.safeParse({
    ticket_id: ticket.id,
    platform_id: Number(body.platformId),
    creator_id: Number(sessionId),
    commited_at: commitedAt,
    hashed: body.hashed,
    message: body.message,
  });

  if (!validateSchema.success) {
    throw new BadRequestResponse(validateSchema.error.message);
  }

  const commit = await Commit.create(validateSchema.data);

  return {
    statusCode: 201,
    body: JSON.stringify(commit),
  };
});

export const update = withApiAuth(async () => {
  const session = useSession();

  if (session.type !== "user") {
    throw new UnauthorizedResponse();
  }

  const commitId = usePathParam("commitId");

  if (!commitId) {
    throw new BadRequestResponse("Missing commit ID");
  }

  const body = useJsonBody();

  if (!body) {
    throw new BadRequestResponse("Missing body");
  }

  const commit = await Commit.findById(commitId, {
    creator_id: session.properties.userID,
  });

  if (!commit) {
    throw new NotFoundResponse("Commit not found");
  }

  const validateSchema = Commit.updateSchema.safeParse({
    platform_id: Number(body.platformId),
    commited_at: new Date(body.commitedAt),
    hashed: body.hashed,
    message: body.message,
  });

  if (!validateSchema.success) {
    throw new BadRequestResponse(validateSchema.error.message);
  }

  await Commit.update(commitId, validateSchema.data);

  return {
    statusCode: 204,
  };
});

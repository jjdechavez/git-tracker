import { useJsonBody } from "sst/node/api";
import { useSession } from "sst/node/auth";
import { Ticket } from "@git-tracker/core/ticket";
import { BadRequestResponse, UnauthorizedResponse, withApiAuth } from "./api";

export const create = withApiAuth(async () => {
  const body = useJsonBody();

  if (!body) {
    throw new BadRequestResponse("Missing body");
  }

  const session = useSession();
  if (session.type !== "user") {
    throw new UnauthorizedResponse();
  }

  const validateSchema = Ticket.createSchema.safeParse({
    name: body.name,
    description: body.description,
    project_id: body.projectId,
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

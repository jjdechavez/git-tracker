import { z } from "zod";
import { externalApi } from ".";

export type NewTicket = {
  name: string;
  description?: string;
  projectSlug: string;
};

export const createTicket = async (newTicket: NewTicket) => {
  const schema = z.object({
    id: z.number(),
  });

  const ticket = await externalApi()
    .url("/tickets")
    .json(newTicket)
    .post()
    .json(schema.parse);

  return ticket;
};

export type SearchPlatforms = {
  projectSlug: string;
};

export const listTickets = async (search: Partial<SearchPlatforms>) => {
  const schema = z.object({
    data: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
        project_id: z.number(),
        description: z.string().optional(),
      })
    ),
  });

  const searchParams = new URLSearchParams(search);
  const params =
    searchParams.toString().length === 0
      ? searchParams.toString()
      : `?${searchParams.toString()}`;

  const tickets = await externalApi()
    .url(`/tickets${params}`)
    .get()
    .json(schema.parse);

  return tickets.data;
};

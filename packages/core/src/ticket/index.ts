export * as Ticket from "./";

import { z } from "zod";
import { db } from "../kysely";
import { idSchema } from "../util/zod";

export const Info = z.object({
  id: z.number(),
  project_id: z.number(),
  creator_id: z.number(),
  name: z.string().trim().min(1),
  description: z.string().trim().optional(),
  created_at: z.date(),
});

export type Info = z.infer<typeof Info>;

export const createSchema = Info.omit({ created_at: true });

export const create = z
  .function()
  .args(createSchema)
  .implement(async (newTicket) =>
    db
      .insertInto("ticket")
      .values(newTicket)
      .returning("ticket.id")
      .executeTakeFirstOrThrow()
  );

export const list = z
  .function()
  .args(idSchema, z.object({ s: z.string().optional(), projectId: idSchema }))
  .implement(async (creatorId, criteria) => {
    let query = db
      .selectFrom("ticket")
      .select([
        "ticket.id",
        "ticket.name",
        "ticket.description",
        "ticket.project_id",
      ]);

    if (criteria.s) {
      query = query.where((eb) => {
        const search = criteria.s as string;

        return eb.or([
          eb("ticket.name", "like", search),
          eb("ticket.description", "like", search),
        ]);
      });
    }

    const tickets = await query
      .where("ticket.creator_id", "=", creatorId)
      .where("ticket.project_id", "=", criteria.projectId)
      .execute();

    return tickets;
  });

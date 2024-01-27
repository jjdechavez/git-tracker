export * as Ticket from "./";
import { jsonArrayFrom } from "kysely/helpers/sqlite";

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

export const createSchema = Info.omit({ id: true, created_at: true });

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
  .args(
    idSchema,
    z.object({
      s: z.string().optional(),
      projectId: idSchema.optional(),
      ticketIds: z.array(idSchema).optional(),
    })
  )
  .implement(async (creatorId, criteria) => {
    let query = db
      .selectFrom("ticket")
      .select((eb) => [
        "ticket.id",
        "ticket.name",
        "ticket.description",
        "ticket.project_id",
        jsonArrayFrom(
          eb
            .selectFrom("commit")
            .innerJoin("platform", "platform.id", "commit.platform_id")
            .select([
              "commit.id",
              "commit.commited_at",
              "commit.platform_id",
              "platform.name as platform_name",
              "commit.hashed",
              "commit.message",
            ])
            .whereRef("commit.ticket_id", "=", "ticket.id")
        ).as("commits"),
      ]);

    if (criteria.s) {
      query = query.where((eb) => {
        const search = criteria.s as string;

        return eb.or([
          eb("ticket.name", "like", `%${search}%`),
          eb("ticket.description", "like", `%${search}%`),
        ]);
      });
    }

    if (criteria.projectId) {
      query = query.where("ticket.project_id", "=", criteria.projectId);
    }

    if (criteria.ticketIds) {
      query = query.where("ticket.id", "in", criteria.ticketIds);
    }

    const tickets = await query
      .where("ticket.creator_id", "=", creatorId)
      .execute();

    return tickets;
  });

export const updateSchema = Info.pick({
  name: true,
  description: true,
}).partial();

export const update = z
  .function()
  .args(idSchema, updateSchema)
  .implement(async (ticketId, updateWith) => {
    await db
      .updateTable("ticket")
      .set(updateWith)
      .where("id", "=", ticketId)
      .execute();
  });

export const findById = z
  .function()
  .args(idSchema, z.object({ creatorId: idSchema }))
  .implement(async (ticketId, criteria) => {
    const ticket = await db
      .selectFrom("ticket")
      .select([
        "ticket.id",
        "ticket.name",
        "ticket.description",
        "ticket.project_id",
      ])
      .where("ticket.id", "=", ticketId)
      .where("ticket.creator_id", "=", criteria.creatorId)
      .executeTakeFirst();

    return ticket;
  });

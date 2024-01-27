export * as Commit from "./";

import { z } from "zod";
import { db } from "../kysely";
import { CommitStatuses } from "./commit.sql";
import { idSchema } from "../util/zod";

export const Info = z.object({
  id: z.number(),
  platform_id: z.number(),
  ticket_id: z.number(),
  creator_id: z.number(),
  commited_at: z.date(),
  hashed: z.string().trim().toLowerCase().min(5),
  message: z.string().trim().optional(),
  status: z.nativeEnum(CommitStatuses),
  created_at: z.date(),
});

export type Info = z.infer<typeof Info>;

export const createSchema = Info.omit({
  id: true,
  created_at: true,
  status: true,
});

export const create = z
  .function()
  .args(createSchema)
  .implement(async (newCommit) =>
    db
      .insertInto("commit")
      .values({
        ...newCommit,
        commited_at: newCommit.commited_at.toISOString(),
        status: CommitStatuses.active,
      })
      .returning("commit.id")
      .executeTakeFirstOrThrow()
  );

export const updateSchema = Info.pick({
  platform_id: true,
  commited_at: true,
  hashed: true,
  message: true,
}).partial();

export const update = z
  .function()
  .args(idSchema, updateSchema)
  .implement(async (commitId, updateWith) => {
    await db
      .updateTable("commit")
      .set({
        ...updateWith,
        commited_at: updateWith.commited_at?.toISOString(),
      })
      .where("id", "=", commitId)
      .execute();
  });

export const findById = z
  .function()
  .args(idSchema, z.object({ creator_id: idSchema }))
  .implement(async (commitId, criteria) => {
    const commit = await db
      .selectFrom("commit")
      .select([
        "commit.id",
        "commit.platform_id",
        "commit.hashed",
        "commit.commited_at",
        "commit.message",
      ])
      .where("commit.id", "=", commitId)
      .where("commit.creator_id", "=", criteria.creator_id)
      .executeTakeFirst();

    return commit;
  });

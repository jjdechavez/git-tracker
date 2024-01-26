export * as Commit from "./";

import { z } from "zod";
import { db } from "../kysely";
import { CommitStatuses } from "./commit.sql";

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

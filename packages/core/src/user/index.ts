export * as User from "./";

import { z } from "zod";
import { db } from "../kysely";
import { idSchema } from "../util/zod";

export const Info = z.object({
  id: z.number(),
  name: z.string().trim().min(1),
  email: z.string().email().trim().toLowerCase().min(1),
  avatar_url: z.string(),
  provider_id: z.number(),
  created_at: z.date(),
});

export type Info = z.infer<typeof Info>;

export const findByEmail = z
  .function()
  .args(Info.shape.email)
  .implement(async (email) =>
    db
      .selectFrom("user")
      .where("email", "=", email)
      .select(["user.id", "user.name", "user.email", "user.avatar_url"])
      .executeTakeFirst()
  );

export const findById = z
  .function()
  .args(idSchema)
  .implement(async (userID) => {
    db.selectFrom("user")
      .where("id", "=", userID)
      .select(["user.id", "user.name", "user.email", "user.avatar_url"])
      .executeTakeFirst();
  });

export const create = z
  .function()
  .args(Info.omit({ id: true, created_at: true }))
  .implement(async (newUser) =>
    db
      .insertInto("user")
      .values(newUser)
      .returning("user.id")
      .executeTakeFirstOrThrow()
  );

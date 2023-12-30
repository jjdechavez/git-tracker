export * as User from "./";

import { z } from "zod";
import { db } from "../kysely";
import { zod } from "../util/zod";

export const Info = z.object({
  id: z.number(),
  name: z.string().trim().min(1),
  email: z.string().email().trim().toLowerCase().min(1),
  avatar_url: z.string(),
  provider_id: z.number(),
  created_at: z.date(),
});

export type Info = z.infer<typeof Info>;

export const findByEmail = zod(Info.shape.email, async (email) =>
  db
    .selectFrom("user")
    .where("email", "=", email)
    .select(["user.id", "user.name", "user.email", "user.avatar_url"])
    .executeTakeFirst()
);

export const create = zod(
  Info.omit({ id: true, created_at: true }),
  async (newUser) =>
    db
      .insertInto("user")
      .values(newUser)
      .returning("user.id")
      .executeTakeFirstOrThrow()
);

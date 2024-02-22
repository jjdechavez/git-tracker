export * as Production from "./";

import { z } from "zod";
import { db } from "../kysely";
import { idSchema } from "../util/zod";

export const Info = z.object({
  id: z.number(),
  pushed_date: z.string(),
  platform_id: z.number(),
  project_id: z.number(),
  creator_id: z.number(),
  created_at: z.date(),
});

export type Info = z.infer<typeof Info>;

export const createSchema = Info.pick({
  pushed_date: true,
  platform_id: true,
  creator_id: true,
  project_id: true,
});

export const create = z
  .function()
  .args(createSchema)
  .implement(async (newProduction) =>
    db
      .insertInto("production")
      .values(newProduction)
      .returning("production.id")
      .executeTakeFirstOrThrow()
  );

export const list = z
  .function()
  .args(
    idSchema,
    z
      .object({
        platform_id: idSchema,
        project_id: idSchema,
        pushed_date: z.string(),
      })
      .partial()
  )
  .implement(async (creatorId, criteria) => {
    let query = db
      .selectFrom("production")
      .innerJoin("platform", "platform.id", "production.platform_id")
      .select([
        "production.id",
        "production.pushed_date",
        "production.created_at",
        "production.platform_id",
        "platform.slug as platform_slug",
      ]);

    if (criteria.platform_id) {
      query = query.where("production.project_id", "=", criteria.platform_id);
    }

    if (criteria.pushed_date) {
      query = query.where("production.pushed_date", "=", criteria.pushed_date);
    }

    if (criteria.project_id) {
      query = query.where("production.project_id", "=", criteria.project_id);
    }

    const projects = await query
      .where("production.creator_id", "=", creatorId)
      .execute();

    return projects;
  });

export const findById = z
  .function()
  .args(
    idSchema,
    z.object({ creator_id: idSchema, project_id: idSchema }).partial()
  )
  .implement(async (productionId, criteria) => {
    let query = db
      .selectFrom("production")
      .innerJoin("platform", "platform_id", "production.platform_id")
      .select([
        "production.id",
        "production.pushed_date",
        "production.platform_id",
        "platform.slug as platform_slug",
      ]);

    if (criteria.creator_id) {
      query = query.where("production.creator_id", "=", criteria.creator_id);
    }

    if (criteria.project_id) {
      query = query.where("production.project_id", "=", criteria.project_id);
    }

    const production = await query
      .where("production.id", "=", productionId)
      .executeTakeFirst();

    return production;
  });

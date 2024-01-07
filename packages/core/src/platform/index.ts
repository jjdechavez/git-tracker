export * as Platform from "./";

import { z } from "zod";
import { db } from "../kysely";
import { PlatformStatuses } from "./platform.sql";
import { kebabCase, serializeStatus } from "../util/sql";
import { idSchema, statusSchema } from "../util/zod";

export const Info = z.object({
  id: z.number(),
  name: z.string().trim().toLowerCase().min(1),
  slug: z.string().trim().toLowerCase().min(1),
  project_id: z.number(),
  creator_id: z.number(),
  status: z.nativeEnum(PlatformStatuses),
  prefix_ticket: z.string().nullable(),
  created_at: z.date(),
});

export type Info = z.infer<typeof Info>;

export const createSchema = Info.pick({
  name: true,
  project_id: true,
  creator_id: true,
  prefix_ticket: true,
});

export const create = z
  .function()
  .args(createSchema)
  .implement(async (newPlatform) =>
    db
      .insertInto("platform")
      .values({
        ...newPlatform,
        slug: kebabCase(newPlatform.name),
        status: PlatformStatuses.active,
      })
      .returning("platform.slug")
      .executeTakeFirstOrThrow()
  );

const RawProject = Info.pick({
  id: true,
  name: true,
  slug: true,
  status: true,
  prefix_ticket: true,
});
type RawProject = z.infer<typeof RawProject>;

export const serialize = (platform: RawProject) =>
  ({
    ...platform,
    status: serializeStatus(platform.status),
  } as const);

export type SerializedProject = typeof serialize;

export const findBySlug = z
  .function()
  .args(z.string(), z.object({ creator_id: idSchema.optional() }))
  .implement(async (slug, criteria) => {
    let query = db
      .selectFrom("platform")
      .select([
        "platform.id",
        "platform.name",
        "platform.slug",
        "platform.status",
        "platform.prefix_ticket",
      ]);

    if (criteria.creator_id) {
      query = query.where("creator_id", "=", criteria.creator_id);
    }

    const result = await query.where("slug", "like", slug).executeTakeFirst();

    if (!result) return undefined;

    return result;
  });

export const list = z
  .function()
  .args(
    idSchema,
    z
      .object({
        slug: Info.shape.slug,
        status: statusSchema,
        project_id: idSchema,
      })
      .partial()
  )
  .implement(async (creatorId, criteria) => {
    let query = db
      .selectFrom("platform")
      .select([
        "platform.id",
        "platform.name",
        "platform.slug",
        "platform.status",
        "platform.prefix_ticket",
      ]);

    if (criteria.slug) {
      query = query.where("slug", "like", kebabCase(criteria.slug));
    }

    if (criteria.status) {
      query = query.where("status", "=", criteria.status);
    }

    if (criteria.project_id) {
      query = query.where("project_id", "=", criteria.project_id);
    }

    const platforms = await query.where("creator_id", "=", creatorId).execute();

    return platforms;
  });

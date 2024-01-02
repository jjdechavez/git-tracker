export * as Project from "./";

import { z } from "zod";
import { db } from "../kysely";
import { ProjectStatuses } from "./project.sql";
import { kebabCase, serializeStatus } from "../util/sql";
import { idSchema } from "../util/zod";

export const Info = z.object({
  id: z.number(),
  name: z.string().trim().toLowerCase().min(1),
  slug: z.string().trim().toLowerCase().min(1),
  creator_id: z.number(),
  status: z.nativeEnum(ProjectStatuses),
  created_at: z.date(),
});

export type Info = z.infer<typeof Info>;

export const createSchema = Info.pick({ name: true, creator_id: true });

export const create = z
  .function()
  .args(createSchema)
  .implement(async (newProject) =>
    db
      .insertInto("project")
      .values({
        ...newProject,
        slug: kebabCase(newProject.name),
        status: ProjectStatuses.active,
      })
      .returning("project.slug")
      .executeTakeFirstOrThrow()
  );

const RawProject = Info.pick({
  id: true,
  name: true,
  slug: true,
  status: true,
});
type RawProject = z.infer<typeof RawProject>;

const serializeProject = (project: RawProject) =>
  ({
    ...project,
    status: serializeStatus(project.status),
  } as const);

export type SerializedProject = typeof serializeProject;

export const findBySlug = z
  .function()
  .args(z.string(), z.object({ creator_id: idSchema.optional() }))
  .implement(async (slug, criteria) => {
    let query = db
      .selectFrom("project")
      .select(["project.id", "project.name", "project.slug", "project.status"]);

    if (criteria.creator_id) {
      query = query.where("creator_id", "=", criteria.creator_id);
    }

    const result = await query.where("slug", "like", slug).executeTakeFirst();

    if (!result) return undefined;

    return serializeProject(result);
  });

export const list = z
  .function()
  .args(idSchema, Info.pick({ slug: true, status: true }).partial())
  .implement(async (creatorId, criteria) => {
    let query = db
      .selectFrom("project")
      .select(["project.id", "project.name", "project.slug", "project.status"]);

    if (criteria.slug) {
      query = query.where("slug", "like", kebabCase(criteria.slug));
    }

    if (criteria.status) {
      query = query.where("status", "=", criteria.status);
    }

    const projects = await query.where("creator_id", "=", creatorId).execute();

    return projects.map(serializeProject);
  });

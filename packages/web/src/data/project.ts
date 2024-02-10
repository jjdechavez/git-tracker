import { z } from "zod";
import { externalApi } from ".";

const projectSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  status: z.enum(["inactive", "active"]),
});

export type Project = z.infer<typeof projectSchema>;

export const createProject = async (name: string) => {
  const schema = z.object({
    slug: z.string(),
  });

  const project = await externalApi()
    .url("/projects")
    .json({ name })
    .post()
    .json(schema.safeParse);

  return project;
};

export const listProjects = async () => {
  const schema = z.object({
    data: z.array(projectSchema),
  });

  const projects = await externalApi()
    .url("/projects")
    .get()
    .json(schema.parse);

  return projects.data;
};

export const findProjectBySlug = async (slug: string) => {
  const schema = z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string(),
    status: z.enum(["inactive", "active"]),
  });

  const project = await externalApi()
    .url(`/projects/${slug}`)
    .get()
    .json(schema.parse);

  return project;
};

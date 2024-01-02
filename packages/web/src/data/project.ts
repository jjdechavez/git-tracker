import { z } from "zod";
import { externalApi } from ".";

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
    data: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
        slug: z.string(),
        status: z.enum(["inactive", "active"]),
      })
    ),
  });

  const projects = await externalApi()
    .url("/projects")
    .get()
    .json(schema.safeParse);

  if (!projects.success) {
    return {
      state: "failed_parse" as const,
      message: projects.error.toString(),
    };
  }

  return {
    state: "ok" as const,
    data: projects.data,
  };
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

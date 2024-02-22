import { z } from "zod";
import { externalApi, getSearchParams } from ".";

export type NewPlatform = {
  name: string;
};

export const platformSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  status: z.enum(["inactive", "active"]),
});

export const createPlatform = async (
  projectSlug: string,
  newPlatform: NewPlatform
) => {
  const schema = z.object({
    slug: z.string(),
  });

  const platform = await externalApi()
    .url(`/projects/${projectSlug}/platforms`)
    .json(newPlatform)
    .post()
    .json(schema.safeParse);

  return platform;
};

export const findPlatformBySlug = async (slug: string) => {
  const platform = await externalApi()
    .url(`/projects/${slug}`)
    .get()
    .json(platformSchema.parse);

  return platform;
};

export type SearchPlatforms = {
  slug: string;
  status: "active" | "inactive";
  project_id: string;
};

export const listPlatforms = async (search: Partial<SearchPlatforms>) => {
  const schema = z.object({
    data: z.array(platformSchema),
  });

  const searchParams = getSearchParams(search);

  const projects = await externalApi()
    .url(`/platforms${searchParams}`)
    .get()
    .json(schema.parse);

  return projects.data;
};

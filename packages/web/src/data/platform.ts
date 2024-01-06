import { z } from "zod";
import { externalApi } from ".";

export type NewPlatform = {
  name: string;
  prefixTicket: string | null;
};

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
  const schema = z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string(),
    status: z.enum(["inactive", "active"]),
    prefix_ticket: z.string().nullable(),
  });

  const platform = await externalApi()
    .url(`/projects/${slug}`)
    .get()
    .json(schema.parse);

  return platform;
};

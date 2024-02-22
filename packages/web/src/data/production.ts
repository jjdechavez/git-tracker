import { z } from "zod";
import { externalApi, getSearchParams } from ".";

const productionSchema = z.object({
  id: z.number(),
  pushed_date: z.string(),
  platform_id: z.number(),
  created_at: z.string(),
  platform_slug: z.string(),
});

type NewProduction = {
  projectId: string;
  pushedDate: string;
  platformId: string;
};

export const createProduction = async (newProduction: NewProduction) => {
  const schema = z.object({
    id: z.number(),
  });

  const production = await externalApi()
    .url("/productions")
    .json(newProduction)
    .post()
    .json(schema.safeParse);

  return production;
};

export type SearchProductions = {
  project_id: string;
};

export const listProductions = async (search: Partial<SearchProductions>) => {
  const schema = z.object({
    data: z.array(productionSchema),
  });

  const searchParams = getSearchParams(search);

  const productions = await externalApi()
    .url(`/productions${searchParams}`)
    .get()
    .json(schema.parse);

  return productions.data;
};

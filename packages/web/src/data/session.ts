import { z } from "zod";
import { externalApi } from ".";

export const getSessionByToken = async (token: string) => {
  const schema = z.object({
    id: z.number(),
    email: z.string(),
  });

  const session = await externalApi()
    .url("/session")
    .auth(`Bearer ${token}`)
    .get()
    .json(schema.safeParse);

  return session;
};

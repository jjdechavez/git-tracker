import { z } from "zod";
import { externalApi } from ".";

export type NewCommit = {
  commitedAt: string;
  platformId: string;
  hashed: string;
  message?: string;
};

export const createCommit = async (ticketId: number, newCommit: NewCommit) => {
  const schema = z.object({
    id: z.number(),
  });

  const commit = await externalApi()
    .url("/commits")
    .json({
      ...newCommit,
      ticketId,
    })
    .post()
    .json(schema.parse);

  return commit;
};

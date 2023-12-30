import { ApiHandler } from "sst/node/api";
import { migrator } from "@git-tracker/core/kysely/migrator";

export const latest = ApiHandler(async (_evt) => {
  const result = await migrator.migrateToLatest();

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
});

export const rollback = ApiHandler(async (_evt) => {
  const result = await migrator.migrateDown();

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
});

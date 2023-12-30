import fs from "fs/promises";
import path from "path";

import { FileMigrationProvider, Migrator } from "kysely";
import { server } from "../util/server.env";
import { db } from "./";

const migrationFolderPath = server.devMode
  ? "packages/core/src/kysely/migrations"
  : "kysely/migrations";

export const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder: path.join(process.cwd(), migrationFolderPath),
  }),
});

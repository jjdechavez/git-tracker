import fs from "fs/promises";
import path from "path";

import { FileMigrationProvider, Migrator } from "kysely";
import { db } from "./";

const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder: path.resolve("./src/kysely/migrations"),
  }),
});

const command = process.argv[2];

async function run() {
  if (!command) {
    console.error("no command provided");
    return;
  }

  if (command === "up") {
    console.log("migrating up");
    return await migrator.migrateUp();
  }

  if (command === "down") {
    console.log("migrating down");
    return await migrator.migrateDown();
  }

  if (command === "latest") {
    console.log("migrating to latest");
    return await migrator.migrateToLatest();
  }

  console.log("migrating to", command);
  return await migrator.migrateTo(command);
}

const results = await run();
if (results) console.log(results);

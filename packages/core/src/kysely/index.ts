import { Kysely, SqliteDialect } from "kysely";
import SQLite from "better-sqlite3";
import { LibsqlDialect } from "@libsql/kysely-libsql";
import { server } from "../util/server.env";

import { UserTable } from "../user/user.sql";
import { ProjectTable } from "../project/project.sql";

interface Database {
  user: UserTable;
  project: ProjectTable;
}

const dialect = server.devMode
  ? new SqliteDialect({
      database: new SQLite("gittracker_dev.db"),
    })
  : new LibsqlDialect({
      url: "placeholder",
      authToken: "placeholder",
    });

export const db = new Kysely<Database>({
  dialect,
});

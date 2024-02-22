import { Kysely, SqliteDialect, ParseJSONResultsPlugin } from "kysely";
import SQLite from "better-sqlite3";
import { LibsqlDialect } from "@libsql/kysely-libsql";
import { server } from "../util/server.env";

import { UserTable } from "../user/user.sql";
import { ProjectTable } from "../project/project.sql";
import { PlatformTable } from "../platform/platform.sql";
import { TicketTable } from "../ticket/ticket.sql";
import { CommitTable } from "../commit/commit.sql";
import { ProductionTable } from "../production/production.sql";

interface Database {
  user: UserTable;
  project: ProjectTable;
  platform: PlatformTable;
  ticket: TicketTable;
  commit: CommitTable;
  production: ProductionTable;
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
  plugins: [new ParseJSONResultsPlugin()],
});

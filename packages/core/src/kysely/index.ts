import { Kysely, SqliteDialect } from "kysely";
import SQLite from "better-sqlite3";
import { LibsqlDialect } from "@libsql/kysely-libsql";
import { UserTable } from "../user/user.sql";

interface Database {
  user: UserTable;
}

const devMode = process.env.IS_LOCAL ?? true;
const dialect = devMode
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

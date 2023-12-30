import { Kysely, sql } from "kysely";

/**
 * @param {Kysely<any>} db
 * @returns {Promise<void>}
 */
export async function up(db) {
  await db.schema
    .createTable("user")
    .addColumn("id", "integer", (col) => col.primaryKey())
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("email", "text", (col) => col.notNull().unique())
    .addColumn("avatar_url", "text", (col) => col.notNull())
    .addColumn("provider_id", "integer", (col) => col.notNull())
    .addColumn("created_at", "text", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .execute();

  await db.schema
    .createIndex("user_name_index")
    .on("user")
    .column("name")
    .execute();
}

/**
 * @param {Kysely<any>} db
 * @returns {Promise<void>}
 */
export async function down(db) {
  await db.schema.dropTable("user").execute();
}

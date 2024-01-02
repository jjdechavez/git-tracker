import { Kysely, sql } from "kysely";

/**
 * @param {Kysely<any>} db
 * @returns {Promise<void>}
 */
export async function up(db) {
  await db.schema
    .createTable("project")
    .addColumn("id", "integer", (col) => col.primaryKey())
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("slug", "text", (col) => col.unique().notNull())
    .addColumn("creator_id", "integer", (col) =>
      col.references("user.id").onDelete("cascade").notNull()
    )
    .addColumn("status", "integer", (col) => col.notNull().defaultTo(1))
    .addColumn("created_at", "text", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .execute();

  await db.schema
    .createIndex("project_creator_id_index")
    .on("project")
    .column("creator_id")
    .execute();
}

/**
 * @param {Kysely<any>} db
 * @returns {Promise<void>}
 */
export async function down(db) {
  await db.schema.dropTable("project").execute();
}

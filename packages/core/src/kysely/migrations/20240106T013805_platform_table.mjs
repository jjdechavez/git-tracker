import { Kysely, sql } from "kysely";

/**
 * @param {Kysely<any>} db
 * @returns {Promise<void>}
 */
export async function up(db) {
  await db.schema
    .createTable("platform")
    .addColumn("id", "integer", (col) => col.primaryKey())
    .addColumn("project_id", "integer", (col) =>
      col.references("project.id").onDelete("cascade").notNull()
    )
    .addColumn("creator_id", "integer", (col) =>
      col.references("user.id").onDelete("cascade").notNull()
    )
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("slug", "text", (col) => col.unique().notNull())
    .addColumn("status", "integer", (col) => col.notNull().defaultTo(1))
    .addColumn("prefix_ticket", "text")
    .addColumn("created_at", "text", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .execute();

  await db.schema
    .createIndex("platform_creator_id_index")
    .on("platform")
    .column("creator_id")
    .execute();

  await db.schema
    .createIndex("platform_project_id_index")
    .on("platform")
    .column("project_id")
    .execute();
}

/**
 * @param {Kysely<any>} db
 * @returns {Promise<void>}
 */
export async function down(db) {
  await db.schema.dropTable("platform").execute();
}

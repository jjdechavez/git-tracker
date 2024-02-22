import { Kysely, sql } from "kysely";

/**
 * @param {Kysely<any>} db
 * @returns {Promise<void>}
 */
export async function up(db) {
  await db.schema
    .createTable("production")
    .addColumn("id", "integer", (col) => col.primaryKey())
    .addColumn("project_id", "integer", (col) =>
      col.references("project.id").onDelete("cascade").notNull()
    )
    .addColumn("creator_id", "integer", (col) =>
      col.references("user.id").onDelete("cascade").notNull()
    )
    .addColumn("platform_id", "integer", (col) =>
      col.references("platform.id").onDelete("cascade").notNull()
    )
    .addColumn("pushed_date", "text", (col) => col.notNull())
    .addColumn("created_at", "text", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .execute();

  await db.schema
    .createIndex("production_project_id_index")
    .on("production")
    .column("project_id")
    .execute();

  await db.schema
    .createIndex("production_creator_id_index")
    .on("production")
    .column("creator_id")
    .execute();

  await db.schema
    .createIndex("production_platform_id_index")
    .on("production")
    .column("platform_id")
    .execute();
}

/**
 * @param {Kysely<any>} db
 * @returns {Promise<void>}
 */
export async function down(db) {
  await db.schema.dropTable("production").execute();
}

import { Kysely, sql } from "kysely";

/**
 * @param {Kysely<any>} db
 * @returns {Promise<void>}
 */
export async function up(db) {
  await db.schema
    .createTable("commit")
    .addColumn("id", "integer", (col) => col.primaryKey())
    .addColumn("platform_id", "integer", (col) =>
      col.references("platform.id").onDelete("cascade").notNull()
    )
    .addColumn("ticket_id", "integer", (col) =>
      col.references("ticket.id").onDelete("cascade").notNull()
    )
    .addColumn("creator_id", "integer", (col) =>
      col.references("user.id").onDelete("cascade").notNull()
    )
    .addColumn("commited_at", "text", (col) => col.notNull())
    .addColumn("hashed", "text", (col) => col.notNull())
    .addColumn("message", "text")
    .addColumn("status", "integer", (col) => col.notNull().defaultTo(1))
    .addColumn("created_at", "text", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .execute();

  await db.schema
    .createIndex("commit_creator_id_index")
    .on("commit")
    .column("creator_id")
    .execute();

  await db.schema
    .createIndex("commit_platform_id_index")
    .on("commit")
    .column("platform_id")
    .execute();

  await db.schema
    .createIndex("commit_ticket_id_index")
    .on("commit")
    .column("ticket_id")
    .execute();
}

/**
 * @param {Kysely<any>} db
 * @returns {Promise<void>}
 */
export async function down(db) {
  await db.schema.dropTable("commit").execute();
}

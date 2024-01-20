import { Kysely } from "kysely";

/**
 * @param {Kysely<any>} db
 * @returns {Promise<void>}
 */
export async function up(db) {
  await db.schema.alterTable("platform").dropColumn("prefix_ticket").execute();
}

/**
 * @param {Kysely<any>} db
 * @returns {Promise<void>}
 */
export async function down(db) {
  await db.schema
    .alterTable("platform")
    .addColumn("prefix_ticket", "text")
    .execute();
}

import { ColumnType, Generated } from "kysely";

export interface TicketTable {
  id: Generated<number>;
  project_id: number;
  creator_id: number;
  name: string;
  description: string | null;
  created_at: ColumnType<Date, string | undefined, never>;
}

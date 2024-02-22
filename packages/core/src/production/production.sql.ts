import { ColumnType, Generated } from "kysely";

export interface ProductionTable {
  id: Generated<number>;
  pushed_date: string;
  project_id: number;
  platform_id: number;
  creator_id: number;
  created_at: ColumnType<Date, string | undefined, never>;
}

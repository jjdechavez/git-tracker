import { ColumnType, Generated } from "kysely";
import { defaultStatuses, DefaultStatus } from "../util/sql";

export interface PlatformTable {
  id: Generated<number>;
  name: string;
  slug: string;
  project_id: number;
  creator_id: number;
  status: PlatformStatus;
  prefix_ticket: string | null
  created_at: ColumnType<Date, string | undefined, never>;
}

export const PlatformStatuses = defaultStatuses;
export type PlatformStatus = DefaultStatus;

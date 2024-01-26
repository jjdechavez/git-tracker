import { Generated, ColumnType } from "kysely";
import { defaultStatuses, DefaultStatus } from "../util/sql";

export interface CommitTable {
  id: Generated<number>;
  platform_id: number;
  ticket_id: number;
  creator_id: number;
  commited_at: string;
  hashed: string;
  message: string | null;
  status: CommitStatus;
  created_at: ColumnType<Date, string | undefined, never>;
}

export const CommitStatuses = defaultStatuses;
export type CommitStatus = DefaultStatus;

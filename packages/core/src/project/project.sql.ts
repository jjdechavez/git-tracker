import { ColumnType, Generated } from "kysely";
import { defaultStatuses, DefaultStatus } from "../util/sql";

export interface ProjectTable {
  id: Generated<number>;
  name: string;
  slug: string;
  creator_id: number;
  status: ProjectStatus;
  created_at: ColumnType<Date, string | undefined, never>;
}

export const ProjectStatuses = defaultStatuses;
export type ProjectStatus = DefaultStatus;

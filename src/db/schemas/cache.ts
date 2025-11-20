import { integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { timestamps } from "../column-helper";

export const cache_metadata = sqliteTable("cache_metadata", {
  id: integer("id").primaryKey(),
  version: integer("version").notNull().default(1),
  ...timestamps,
});

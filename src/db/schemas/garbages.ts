import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { timestamps } from "../column-helper";

export const garbageCategories = sqliteTable("garbage_categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  ...timestamps,
});

export const garbageItems = sqliteTable("garbage_Items", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  garbageCategory: text("garbage_category")
    .notNull()
    .references(() => garbageCategories.id, { onDelete: "cascade" }),
  note: text("note"),
  ...timestamps,
});

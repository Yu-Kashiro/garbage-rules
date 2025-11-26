import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { timestamps } from "../column-helper";

export const garbageCategories = sqliteTable("garbage_categories", {
  id: integer("id").primaryKey(),
  name: text("name").notNull().unique(),
  ...timestamps,
});

export const garbageItems = sqliteTable("garbage_items", {
  id: integer("id").primaryKey(),
  name: text("name").notNull().unique(),
  garbageCategory: integer("garbage_category")
    .notNull()
    .references(() => garbageCategories.id, { onDelete: "cascade" }),
  note: text("note"),
  search: text("search"),
  ...timestamps,
});

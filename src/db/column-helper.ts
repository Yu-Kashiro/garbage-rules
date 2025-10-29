import { sql } from "drizzle-orm";
import { integer, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

export const timestamps = {
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
};

// 使用例
// export const users = sqliteTable("pets", {
//   id: text("id").primaryKey(),
//   name: text("name").notNull(),
//   ...timestamps,
// });

// ついでに id カラムも汎用化しておくと便利です
export const id = text("id")
  .primaryKey()
  .$defaultFn(() => nanoid(10));

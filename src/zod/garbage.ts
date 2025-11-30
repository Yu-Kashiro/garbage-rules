import { garbageCategories, garbageItems } from "@/db/schemas/garbage";
import { isValidColor } from "@/lib/colors";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const garbageCategoryFormSchema = createInsertSchema(garbageCategories, {
  name: z.string().trim().min(1, "分別区分名称は1文字以上入力してください"),
  color: z
    .string()
    .refine((val) => isValidColor(val), "有効な色を選択してください"),
}).omit({
  id: true,
});

export const garbageItemFormSchema = createInsertSchema(garbageItems, {
  name: z.string().trim().min(1, "品目名は1文字以上入力してください"),
  garbageCategory: z.number().int().positive("分別区分を選択してください"),
  note: z.string().optional(),
  search: z.string().optional(),
}).omit({
  id: true,
});

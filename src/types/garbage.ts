import { garbageCategories, garbageItems } from "@/db/schemas/garbage";
import {
  garbageCategoryFormSchema,
  garbageItemFormSchema,
} from "@/zod/garbage";
import { z } from "zod";

export type GarbageCategory = typeof garbageCategories.$inferSelect;
export type GarbageCategoryFormData = z.infer<typeof garbageCategoryFormSchema>;

export type GarbageItem = typeof garbageItems.$inferSelect;
export type GarbageItemFormSchema = z.infer<typeof garbageItemFormSchema>;

// テーブル表示用の型（カテゴリ名を含む）
export type GarbageItemWithCategory = Omit<GarbageItem, "garbageCategory"> & {
  garbageCategory: string;
};

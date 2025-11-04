"use cache";
import "server-only";

import { db } from "@/db";
import { GarbageItemWithCategory } from "@/types/garbage";
import { garbageCategories, garbageItems } from "@/db/schemas/garbage";
import { eq, like } from "drizzle-orm";
import { cacheLife } from "next/cache";

export async function getGarbageItems(): Promise<GarbageItemWithCategory[]> {
  "use cache";
  cacheLife("hours");

  const result = await db
    .select()
    .from(garbageItems)
    .innerJoin(
      garbageCategories,
      eq(garbageItems.garbageCategory, garbageCategories.id)
    );

  // フラットな構造にマップし、カテゴリIDをカテゴリ名に変換
  return result.map((row) => ({
    id: row.garbage_Items.id,
    name: row.garbage_Items.name,
    garbageCategory: row.garbage_categories.name,
    note: row.garbage_Items.note,
    createdAt: row.garbage_Items.createdAt,
    updatedAt: row.garbage_Items.updatedAt,
  }));
}

export const searchGarbageItem = async (
  name: string
): Promise<GarbageItemWithCategory[]> => {
  "use cache";
  cacheLife("minutes");

  const result = await db
    .select()
    .from(garbageItems)
    .innerJoin(
      garbageCategories,
      eq(garbageItems.garbageCategory, garbageCategories.id)
    )
    .where(like(garbageItems.name, `%${name}%`));

  // フラットな構造にマップし、カテゴリIDをカテゴリ名に変換
  return result.map((row) => ({
    id: row.garbage_Items.id,
    name: row.garbage_Items.name,
    garbageCategory: row.garbage_categories.name,
    note: row.garbage_Items.note,
    createdAt: row.garbage_Items.createdAt,
    updatedAt: row.garbage_Items.updatedAt,
  }));
};

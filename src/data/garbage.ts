"use cache";
import "server-only";

import { db } from "@/db";
import { garbageCategories, garbageItems } from "@/db/schemas/garbage";
import { GarbageItemWithCategory } from "@/types/garbage";
import { eq } from "drizzle-orm";
import { cacheLife } from "next/cache";

export async function getGarbageItems(): Promise<GarbageItemWithCategory[]> {
  "use cache";
  cacheLife("days");

  const result = await db
    .select()
    .from(garbageItems)
    .innerJoin(
      garbageCategories,
      eq(garbageItems.garbageCategory, garbageCategories.id)
    );

  // フラットな構造にマップし、カテゴリIDをカテゴリ名に変換
  return result.map((row) => ({
    id: row.garbage_items.id,
    name: row.garbage_items.name,
    garbageCategory: row.garbage_categories.name,
    note: row.garbage_items.note,
    createdAt: row.garbage_items.createdAt,
    updatedAt: row.garbage_items.updatedAt,
  }));
}

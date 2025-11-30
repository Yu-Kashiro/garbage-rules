import "server-only";

import { db } from "@/db";
import { garbageCategories, garbageItems } from "@/db/schemas/garbage";
import {
  GarbageCategory,
  GarbageItem,
  GarbageItemWithCategory,
} from "@/types/garbage";
import { eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

// カテゴリーの一覧取得
export async function getGarbageCategories(): Promise<GarbageCategory[]> {
  "use cache";
  cacheLife("days");
  cacheTag("garbage-categories");

  const result = await db.select().from(garbageCategories);
  return result;
}

// ごみ品目一覧取得(市民閲覧用)
export async function getGarbageItems(): Promise<GarbageItemWithCategory[]> {
  "use cache";
  cacheLife("days");
  cacheTag("garbage-items");

  const result = await db
    .select()
    .from(garbageItems)
    .innerJoin(
      garbageCategories,
      eq(garbageItems.garbageCategory, garbageCategories.id)
    );

  // フラットな構造にマップし、カテゴリIDをカテゴリ名に変換、カテゴリ色を追加
  return result.map((row) => ({
    id: row.garbage_items.id,
    name: row.garbage_items.name,
    garbageCategory: row.garbage_categories.name,
    categoryColor: row.garbage_categories.color,
    note: row.garbage_items.note,
    search: row.garbage_items.search,
    createdAt: row.garbage_items.createdAt,
    updatedAt: row.garbage_items.updatedAt,
  }));
}

// ごみ品目一覧取得(管理画面用)
export async function getGarbageItemsWithId(): Promise<GarbageItem[]> {
  "use cache";
  cacheLife("days");
  cacheTag("garbage-items-admin");

  const result = await db.select().from(garbageItems);
  return result;
}

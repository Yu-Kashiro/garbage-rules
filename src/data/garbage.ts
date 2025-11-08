"use cache";
import "server-only";

import { db } from "@/db";
import { GarbageItemWithCategory } from "@/types/garbage";
import { garbageCategories, garbageItems } from "@/db/schemas/garbage";
import { eq } from "drizzle-orm";
import { cacheLife } from "next/cache";
import Fuse from "fuse.js";
import { garbageFuseOptions } from "@/lib/fuse-config";

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

export const searchGarbageItem = async (
  name: string
): Promise<GarbageItemWithCategory[]> => {
  "use cache";
  cacheLife("days");

  // 全てのゴミアイテムを取得
  const allItems = await getGarbageItems();

  // Fuse.jsの設定
  const fuse = new Fuse(allItems, garbageFuseOptions);

  // あいまい検索を実行
  const results = fuse.search(name);

  // スコア順にソート済みの結果を返す
  return results.map((result) => result.item);
};

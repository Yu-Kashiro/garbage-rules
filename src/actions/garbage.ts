"use server";

import { db } from "@/db";
import { garbageCategories, garbageItems } from "@/db/schemas/garbage";
import { updateCacheVersion } from "@/data/cache";
import { verifySession } from "@/lib/session";
import type {
  GarbageCategoryFormData,
  GarbageItemFormData,
} from "@/types/garbage";
import {
  garbageCategoryFormSchema,
  garbageItemFormSchema,
} from "@/zod/garbage";
import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";

function isUniqueConstraintError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const cause = error.cause as { code?: string } | undefined;
  return cause?.code === "SQLITE_CONSTRAINT";
}

// カテゴリー新規登録
export async function createGarbageCategory(formData: GarbageCategoryFormData) {
  await verifySession();
  const data = garbageCategoryFormSchema.parse(formData);

  try {
    await db.insert(garbageCategories).values({ ...data });
    updateCacheVersion();
    updateTag("garbage-categories");
    updateTag("cache-metadata");
    return { success: true } as const;
  } catch (error) {
    console.error("Failed to create garbage category:", error);
    if (isUniqueConstraintError(error)) {
      return { success: false, error: "同じ名前の分別区分が既に存在します" } as const;
    }
    return { success: false, error: "ごみ分別区分の登録に失敗しました" } as const;
  }
}

// カテゴリー修正
export async function updateGarbageCategory(
  id: number,
  formData: GarbageCategoryFormData
) {
  await verifySession();
  const data = garbageCategoryFormSchema.parse(formData);

  try {
    await db
      .update(garbageCategories)
      .set({ ...data })
      .where(eq(garbageCategories.id, id));
    updateCacheVersion();
    updateTag("garbage-categories");
    updateTag("garbage-items");/* next.js側のキャッシュ更新 */
    updateTag("cache-metadata");/* ブラウザ側のキャッシュ更新 */
    return { success: true } as const;
  } catch (error) {
    console.error("ごみ分別区分の更新に失敗しました。:", error);
    if (isUniqueConstraintError(error)) {
      return { success: false, error: "同じ名前の分別区分が既に存在します" } as const;
    }
    return { success: false, error: "ごみ分別区分の更新に失敗しました" } as const;
  }
}

// カテゴリー削除
export async function deleteGarbageCategory(id: number) {
  await verifySession();
  try {
    await db.delete(garbageCategories).where(eq(garbageCategories.id, id));
    updateCacheVersion();
    updateTag("garbage-categories");
    updateTag("garbage-items");/* next.js側のキャッシュ更新 */
    updateTag("cache-metadata");/* ブラウザ側のキャッシュ更新 */
    return { success: true } as const;
  } catch (error) {
    console.error("ごみ分別区分の削除に失敗しました。:", error);
    return { success: false, error: "ごみ分別区分の削除に失敗しました" } as const;
  }
}

// ごみ品目新規登録
export async function createGarbageItem(formData: GarbageItemFormData) {
  await verifySession();
  const data = garbageItemFormSchema.parse(formData);

  try {
    await db.insert(garbageItems).values({ ...data });
    updateCacheVersion();
    updateTag("garbage-items");
    updateTag("garbage-items-admin");
    updateTag("cache-metadata");
    return { success: true } as const;
  } catch (error) {
    console.error("Failed to create garbage item:", error);
    if (isUniqueConstraintError(error)) {
      return { success: false, error: "同じ名前のごみ品目が既に存在します" } as const;
    }
    return { success: false, error: "ごみ品目の登録に失敗しました" } as const;
  }
}

// ごみ品目修正
export async function updateGarbageItem(
  id: number,
  formData: GarbageItemFormData
) {
  await verifySession();
  const data = garbageItemFormSchema.parse(formData);

  try {
    await db
      .update(garbageItems)
      .set({ ...data })
      .where(eq(garbageItems.id, id));
    updateCacheVersion();
    updateTag("garbage-items");
    updateTag("garbage-items-admin");
    updateTag("cache-metadata");
    return { success: true } as const;
  } catch (error) {
    console.error("ごみ品目の更新に失敗しました。:", error);
    if (isUniqueConstraintError(error)) {
      return { success: false, error: "同じ名前のごみ品目が既に存在します" } as const;
    }
    return { success: false, error: "ごみ品目の更新に失敗しました" } as const;
  }
}

// ごみ品目削除
export async function deleteGarbageItem(id: number) {
  await verifySession();

  try {
    await db.delete(garbageItems).where(eq(garbageItems.id, id));
    updateCacheVersion();
    updateTag("garbage-items");
    updateTag("garbage-items-admin");
    updateTag("cache-metadata");
    return { success: true } as const;
  } catch (error) {
    console.error("ごみ品目の削除に失敗しました。:", error);
    return { success: false, error: "ごみ品目の削除に失敗しました" } as const;
  }
}

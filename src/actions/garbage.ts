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

// カテゴリー新規登録
export async function createGarbageCategory(formData: GarbageCategoryFormData) {
  const data = garbageCategoryFormSchema.parse(formData);
  await verifySession();

  try {
    await db.insert(garbageCategories).values({ ...data });
    updateCacheVersion();
    updateTag("garbage-categories");
    updateTag("garbage-items");
  } catch (error) {
    console.error("Failed to create garbage category:", error);
    throw new Error("ごみ分別区分の登録に失敗しました");
  }
}

// カテゴリー修正
export async function updateGarbageCategory(
  id: number,
  formData: GarbageCategoryFormData
) {
  const data = garbageCategoryFormSchema.parse(formData);
  await verifySession();

  try {
    await db
      .update(garbageCategories)
      .set({ ...data })
      .where(eq(garbageCategories.id, id));
    updateCacheVersion();
    updateTag("garbage-categories");
    updateTag("garbage-items");
  } catch (error) {
    console.error("ごみ分別区分の更新に失敗しました。:", error);
    throw new Error("ごみ分別区分の更新に失敗しました");
  }
}

// カテゴリー削除
export async function deleteGarbageCategory(id: number) {
  await verifySession();
  try {
    await db.delete(garbageCategories).where(eq(garbageCategories.id, id));
    updateCacheVersion();
    updateTag("garbage-categories");
    updateTag("garbage-items");
  } catch (error) {
    console.error("ごみ分別区分の削除に失敗しました。:", error);
    throw new Error("ごみ分別区分の削除に失敗しました");
  }
}

// ごみ品目新規登録
export async function createGarbageItem(formData: GarbageItemFormData) {
  const data = garbageItemFormSchema.parse(formData);
  await verifySession();

  try {
    await db.insert(garbageItems).values({ ...data });
    updateCacheVersion();
    updateTag("garbage-items");
    updateTag("garbage-items-admin");
  } catch (error) {
    console.error("Failed to create garbage item:", error);
    throw new Error("ごみ品目の登録に失敗しました");
  }
}

// ごみ品目修正
export async function updateGarbageItem(
  id: number,
  formData: GarbageItemFormData
) {
  const data = garbageItemFormSchema.parse(formData);
  await verifySession();

  try {
    await db
      .update(garbageItems)
      .set({ ...data })
      .where(eq(garbageItems.id, id));
    updateCacheVersion();
    updateTag("garbage-items");
    updateTag("garbage-items-admin");
  } catch (error) {
    console.error("ごみ品目の更新に失敗しました。:", error);
    throw new Error("ごみ品目の更新に失敗しました");
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
  } catch (error) {
    console.error("ごみ品目の削除に失敗しました。:", error);
    throw new Error("ごみ品目の削除に失敗しました");
  }
}

import "server-only";
import { db } from "@/db";
import { cache_metadata } from "@/db/schemas/cache";

export const getCacheVersion = async () => {
  const cachedData = await db.query.cache_metadata.findFirst();
  if (!cachedData) {
    return 1;
  }
  return cachedData.version;
};

export const updateCacheVersion = async () => {
  const cachedData = await db.query.cache_metadata.findFirst();

  if (!cachedData) {
    // 初期データが存在しない場合は新規作成
    await db.insert(cache_metadata).values({
      id: 1,
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return;
  }

  const newVersion = cachedData.version + 1;
  await db.update(cache_metadata).set({ version: newVersion });
};

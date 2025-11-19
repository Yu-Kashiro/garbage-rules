const CACHE_NAME = "garbage-items-cache";

//  キャッシュからデータを取得
export const getCacheData = async <T>(url: string): Promise<T | null> => {
  if (typeof window === "undefined" || !("caches" in window)) {
    return null;
  }

  try {
    const cacheStorage = await caches.open(CACHE_NAME);
    const cachedResponse = await cacheStorage.match(url);

    if (!cachedResponse || !cachedResponse.ok) {
      return null;
    }

    return (await cachedResponse.json()) as T;
  } catch (error) {
    console.error("キャッシュからのデータ取得に失敗しました:", error);
    return null;
  }
};

// キャッシュにデータを保存;
export const setCacheData = async <T>(url: string, data: T): Promise<void> => {
  if (typeof window === "undefined" || !("caches" in window)) {
    return;
  }

  try {
    const cacheStorage = await caches.open(CACHE_NAME);
    const response = new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    });
    await cacheStorage.put(url, response);
  } catch (error) {
    console.error("キャッシュへのデータ保存に失敗しました:", error);
  }
};

// キャッシュをクリア;
export const clearCache = async (): Promise<void> => {
  if (typeof window === "undefined" || !("caches" in window)) {
    return;
  }

  try {
    await caches.delete(CACHE_NAME);
  } catch (error) {
    console.error("キャッシュのクリアに失敗しました:", error);
  }
};

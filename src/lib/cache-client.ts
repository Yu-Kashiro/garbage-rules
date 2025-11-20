const CACHE_PREFIX = "garbage-items-cache";

// APIからキャッシュバージョンを取得
const getCacheVersion = async (): Promise<number> => {
  try {
    const response = await fetch("/api/garbage-items", { method: "HEAD" });
    const version = response.headers.get("X-Cache-Version");
    return version ? parseInt(version, 10) : 1;
  } catch (error) {
    console.error("キャッシュバージョンの取得に失敗しました:", error);
    return 1;
  }
};

// バージョン付きキャッシュ名を生成
const getCacheName = async (): Promise<string> => {
  const version = await getCacheVersion();
  return `${CACHE_PREFIX}-v${version}`;
};

// キャッシュにデータを保存;
export const setCacheData = async <T>(url: string, data: T): Promise<void> => {
  if (typeof window === "undefined" || !("caches" in window)) {
    return;
  }

  try {
    const cacheName = await getCacheName();
    const cacheStorage = await caches.open(cacheName);
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

//  キャッシュからデータを取得
export const getCacheData = async <T>(url: string): Promise<T | null> => {
  if (typeof window === "undefined" || !("caches" in window)) {
    return null;
  }

  try {
    const cacheName = await getCacheName();
    const cacheStorage = await caches.open(cacheName);
    const cachedResponse = await cacheStorage.match(url);

    if (!cachedResponse || !cachedResponse.ok) {
      return null;
    }

    // 古いキャッシュを非同期で削除
    cleanOldCaches(cacheName);

    return (await cachedResponse.json()) as T;
  } catch (error) {
    console.error("キャッシュからのデータ取得に失敗しました:", error);
    return null;
  }
};

// currentCacheName以外のキャッシュを削除
const cleanOldCaches = async (currentCacheName: string): Promise<void> => {
  if (typeof window === "undefined" || !("caches" in window)) {
    return;
  }

  try {
    const cacheNames = await caches.keys();
    const oldCaches = cacheNames.filter(
      (name) => name.startsWith(CACHE_PREFIX) && name !== currentCacheName
    );

    await Promise.all(oldCaches.map((name) => caches.delete(name)));
  } catch (error) {
    console.error("古いキャッシュの削除に失敗しました:", error);
  }
};

// キャッシュを全てクリア(ログアウト時、ユーザーが「データを最新に更新」ボタンを押した時等)
export const clearAllCache = async (): Promise<void> => {
  if (typeof window === "undefined" || !("caches" in window)) {
    return;
  }

  try {
    const cacheNames = await caches.keys();
    const garbageCaches = cacheNames.filter((name) =>
      name.startsWith(CACHE_PREFIX)
    );
    await Promise.all(garbageCaches.map((name) => caches.delete(name)));
  } catch (error) {
    console.error("キャッシュのクリアに失敗しました:", error);
  }
};

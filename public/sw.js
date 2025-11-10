// キャッシュの名前（バージョン管理用）
const CACHE_NAME = "garbage-rules-v1";

// インストールイベント: サービスワーカーがインストールされたときに実行される
self.addEventListener("install", () => {
  console.log("[Service Worker] インストール中...");
  // すぐに新しいService Workerをアクティブ化
  self.skipWaiting();
});

// アクティベートイベント: 新しいサービスワーカーがアクティブになったときに実行される
// 古いキャッシュを削除します
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] アクティベート中...");

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // 現在のキャッシュ名と違うキャッシュを削除
          if (cacheName !== CACHE_NAME) {
            console.log("[Service Worker] 古いキャッシュを削除:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// フェッチイベント: ネットワークリクエストが発生したときに実行される
// /api/garbage-items のみキャッシュ戦略を適用
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // /api/garbage-items エンドポイントの場合のみキャッシュ処理
  if (url.pathname === "/api/garbage-items") {
    event.respondWith(cacheFirst(event.request));
  } else {
    // その他のリクエストは通常通りネットワークから取得
    event.respondWith(fetch(event.request));
  }
});

// キャッシュ優先戦略（/api/garbage-items 専用）
// まずキャッシュを探し、なければネットワークから取得
async function cacheFirst(request) {
  // キャッシュから探す
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    console.log("[Service Worker] キャッシュから返却:", request.url);
    return cachedResponse;
  }

  // キャッシュになければネットワークから取得
  try {
    console.log("[Service Worker] ネットワークから取得:", request.url);
    const networkResponse = await fetch(request);

    // 成功したらキャッシュに保存（APIレスポンスのみ）
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error("[Service Worker] フェッチ失敗:", error);
    // エラーレスポンスを返す
    return new Response("ネットワークエラー", {
      status: 408,
      headers: { "Content-Type": "text/plain" },
    });
  }
}

// サービスワーカー - キャッシュ戦略の実装
// このファイルはブラウザのバックグラウンドで動作し、ネットワークリクエストを管理します

// キャッシュの名前（バージョン管理用）
const CACHE_NAME = "garbage-rules-v1";

// 最初にキャッシュするファイル（事前キャッシュ）
// アプリの基本的なファイルをここに指定します
// Note: Next.jsでは静的ファイルは実行時に動的に生成されるため、
// 事前キャッシュは最小限にし、実際のキャッシュはfetchイベントで行います
const PRECACHE_URLS = [
  "/",
];

// インストールイベント: サービスワーカーがインストールされたときに実行される
// ここで事前キャッシュを行います
self.addEventListener("install", (event) => {
  console.log("[Service Worker] インストール中...");

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[Service Worker] 事前キャッシュを開始");
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => {
        console.log("[Service Worker] 事前キャッシュ完了");
      })
  );
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
// ここでキャッシュ戦略を実装します
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Next.jsの内部ファイル(_next/static)は「キャッシュ優先」戦略
  if (url.pathname.startsWith("/_next/static")) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  // 画像ファイルは「キャッシュ優先」戦略
  if (url.pathname.match(/\.(png|jpg|jpeg|svg|gif|webp|ico)$/)) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  // JSONファイル（データ）は「キャッシュ優先」戦略
  if (url.pathname.endsWith(".json")) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  // その他のリクエストは「ネットワーク優先」戦略
  event.respondWith(networkFirst(event.request));
});

// キャッシュ優先戦略
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

    // 成功したらキャッシュに保存
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

// ネットワーク優先戦略
// まずネットワークから取得を試み、失敗したらキャッシュから返す
async function networkFirst(request) {
  try {
    console.log("[Service Worker] ネットワークから取得:", request.url);
    const networkResponse = await fetch(request);

    // 成功したらキャッシュに保存
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch {
    console.log(
      "[Service Worker] ネットワーク失敗、キャッシュを確認:",
      request.url
    );

    // ネットワークが失敗したらキャッシュから探す
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      console.log("[Service Worker] キャッシュから返却:", request.url);
      return cachedResponse;
    }

    // キャッシュにもなければエラー
    console.error("[Service Worker] キャッシュにもありません:", request.url);
    return new Response("オフラインです", {
      status: 503,
      headers: { "Content-Type": "text/plain" },
    });
  }
}

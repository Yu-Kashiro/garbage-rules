# PWA キャッシュと Fuse.js 検索の統合ガイド

## 概要

このドキュメントは、PWA の Cache API を使用してデータベースをキャッシュし、Fuse.js であいまい検索を実行する際の注意点とベストプラクティスをまとめたものです。

## 現在の実装構成

### アーキテクチャ

```
ユーザー入力
    ↓
nuqs (URLパラメータ管理)
    ↓
Next.jsページレンダリング
    ↓
データフェッチ
    ↓
Service Worker (PWAキャッシュ)
    ↓
Fuse.js検索実行
    ↓
検索結果表示
```

### 主要コンポーネント

- **Service Worker** (`public/sw.js`): Cache API でリソースをキャッシュ
- **検索フォーム** (`src/components/garbage-search-form.tsx`): nuqs で URL 状態管理
- **データ取得・検索** (`src/data/garbage.ts`): Fuse.js であいまい検索
- **ページ** (`src/app/page.tsx`): サーバーサイドレンダリング

## PWA キャッシュと Fuse.js 検索の注意点

### 1. Fuse インスタンスの初期化タイミング

#### 問題点

- Fuse.js はデータからインデックスを作成するため、初期化コストがかかる
- 大量データの場合、毎回インスタンスを作成すると性能低下の原因になる

#### 対策

**サーバーサイド実装（現在）:**

```typescript
export const searchGarbageItem = async (name: string) => {
  "use cache";
  cacheLife("minutes");

  const allItems = await getGarbageItems();
  const fuse = new Fuse(allItems, {
    keys: ["name", "note"],
    threshold: 0.3,
    distance: 100,
    minMatchCharLength: 1,
    includeScore: true,
  });

  return fuse.search(name).map((result) => result.item);
};
```

**クライアントサイド実装（最適化版）:**

```typescript
"use client";

import { useEffect, useState, useMemo } from "react";
import Fuse from "fuse.js";

export function useGarbageSearch(query: string) {
  const [items, setItems] = useState([]);

  // データ取得（Service Workerがキャッシュから返す）
  useEffect(() => {
    fetch("/api/garbage-items")
      .then((res) => res.json())
      .then((data) => setItems(data));
  }, []);

  // Fuseインスタンスはデータが変わらない限り再利用
  const fuse = useMemo(() => {
    if (items.length === 0) return null;
    return new Fuse(items, {
      keys: ["name", "note"],
      threshold: 0.3,
      distance: 100,
      minMatchCharLength: 1,
    });
  }, [items]); // itemsが変更された時のみ再作成

  // 検索実行
  const results = useMemo(() => {
    if (!fuse || !query) return items;
    return fuse.search(query).map((result) => result.item);
  }, [fuse, query, items]);

  return { results };
}
```

### 2. データの鮮度とキャッシュ戦略

#### 問題点

- キャッシュされたデータが古くなる可能性
- 古いデータで検索すると、最新の情報が表示されない

#### 対策

**現在のキャッシュ戦略（Cache First）:**

```javascript
// sw.js
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  const networkResponse = await fetch(request);
  if (networkResponse.ok) {
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());
  }

  return networkResponse;
}
```

**キャッシュバージョン管理:**

```javascript
// バージョンを上げると古いキャッシュが削除される
const CACHE_NAME = "garbage-rules-v2"; // v1 → v2

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

### 3. メモリ使用量

#### 問題点

- Fuse.js は検索インデックスをメモリに保持
- 大量データの場合、ブラウザのメモリを圧迫

#### 推奨値

- **小規模**: 〜500 件 → 問題なし
- **中規模**: 500〜5,000 件 → useMemo で最適化推奨
- **大規模**: 5,000 件〜 → IndexedDB + Web Worker 検討

### 4. 検索パフォーマンス

#### デバウンス処理（必須）

現在の実装では既に対応済み:

```typescript
// garbage-search-form.tsx
<Input
  value={name}
  onChange={(e) =>
    setName(e.target.value, {
      limitUrlUpdates: e.target.value === "" ? undefined : debounce(50),
    })
  }
/>
```

- キー入力ごとの検索実行を防ぐ
- 50ms のデバウンスで適切なレスポンス

### 5. IndexedDB の併用検討

大量データの場合、Cache API より IndexedDB が適している:

#### Cache API vs IndexedDB

| 特徴   | Cache API       | IndexedDB          |
| ------ | --------------- | ------------------ |
| 用途   | HTTP レスポンス | 構造化データ       |
| 容量   | 制限あり        | 大容量対応         |
| クエリ | 不可            | 可能               |
| 検索   | 不可            | インデックス検索可 |

#### IndexedDB 実装例

```javascript
// Service Worker内
const DB_NAME = "garbage-rules-db";
const STORE_NAME = "garbage-items";

async function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("name", "name", { unique: false });
        store.createIndex("category", "garbageCategory", { unique: false });
      }
    };
  });
}

async function saveToIndexedDB(items) {
  const db = await openDatabase();
  const transaction = db.transaction([STORE_NAME], "readwrite");
  const store = transaction.objectStore(STORE_NAME);

  items.forEach((item) => store.put(item));

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

async function getFromIndexedDB() {
  const db = await openDatabase();
  const transaction = db.transaction([STORE_NAME], "readonly");
  const store = transaction.objectStore(STORE_NAME);

  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
```

## nuqs の必要性

### nuqs と PWA キャッシュの関係

**結論: nuqs と PWA キャッシュは独立して動作し、相性が良い**

#### 動作レイヤー

```
nuqs (URLパラメータ管理)
  ↓ ブラウザのURL API（メモリ上で動作）
  ↓
Service Worker (PWAキャッシュ)
  ↓ ネットワークリクエストをインターセプト（HTTP層で動作）
  ↓
キャッシュ or ネットワーク
```

### nuqs を使用する利点

| 要件               | nuqs 必要? | 理由                     |
| ------------------ | ---------- | ------------------------ |
| URL 共有したい     | ✅ 必要    | 検索状態を URL で保持    |
| SEO 対策したい     | ✅ 必要    | サーバーレンダリング可能 |
| ブックマーク対応   | ✅ 必要    | URL 状態保持             |
| ブラウザ履歴対応   | ✅ 必要    | 戻る/進むで検索履歴      |
| オフライン検索のみ | ❌ 不要    | `useState`で十分         |
| 単純な検索 UI      | ❌ 不要    | ローカル状態管理で十分   |

### オフライン動作の例

**シナリオ 1: 初回オンライン時**

```
ユーザー: "バッテリー"と入力
    ↓ nuqsが ?name=バッテリー にURLを更新
    ↓ ページ遷移/再レンダリング
    ↓ データフェッチ
    ↓ Service Workerがレスポンスをキャッシュ
```

**シナリオ 2: オフライン時**

```
ユーザー: URLを直接入力 or ブックマークから ?name=水筒
    ↓ nuqsが "水筒" を読み取る (オフラインでもOK)
    ↓ ページレンダリング試行
    ↓ Service Workerがキャッシュから返す
    ↓ キャッシュされたデータで検索結果表示
```

### useState 代替案（nuqs 不要の場合）

```typescript
"use client";

import { useState } from "react";
import { Input } from "./ui/input";

export function GarbageSearchForm({
  onSearch,
}: {
  onSearch: (results: any[]) => void;
}) {
  const [query, setQuery] = useState("");

  return (
    <Input
      value={query}
      placeholder="例:バッテリー、水筒、茶碗..."
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
```

## PWA キャッシュ利用時の nuqs への影響

### 結論: 影響なし

**理由:**

- ✅ nuqs と PWA キャッシュは独立して動作
- ✅ お互いに干渉しない
- ✅ むしろ組み合わせで強力（URL 状態管理 + オフライン対応）
- ✅ 現在の実装のまま問題なし

### 動作フロー

```javascript
// オフラインでも動作する完全な流れ:

// 1. ユーザーが ?name=バッテリー にアクセス
// 2. nuqsが "バッテリー" を取得 ✓ (URLから読み取るだけなのでオフラインOK)
// 3. Next.jsがページをレンダリング ✓ (キャッシュされたHTMLを使用)
// 4. データもキャッシュから取得 ✓ (Service Workerが返す)
// 5. Fuse検索実行 ✓ (クライアント側で実行)
// 6. 検索結果表示 ✓
```

## ベストプラクティス

### 推奨実装（現在の構成）

#### 小〜中規模データ（〜5,000 件）

1. **サーバーサイドレンダリング** + `"use cache"`
2. **nuqs**で URL 状態管理
3. **Service Worker**で Cache First 戦略
4. **Fuse.js**でサーバーサイド検索

#### 大規模データ（5,000 件〜）

1. **クライアントサイドレンダリング**
2. **IndexedDB**でデータ保存
3. **useMemo**で Fuse インスタンス最適化
4. **Web Worker**で検索処理をオフロード（検討）

### キャッシュ戦略の選択

#### Cache First（現在の実装）

```javascript
// 適用対象: 更新頻度が低いデータ
// - 静的アセット (_next/static/*)
// - 画像ファイル
// - ゴミ分類データ（あまり変更されない）
```

#### Network First

```javascript
// 適用対象: 更新頻度が高いデータ
// - ユーザーデータ
// - リアルタイムデータ
// - APIレスポンス（最新情報が重要）

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    return await caches.match(request);
  }
}
```

### デバッグとモニタリング

#### Service Worker の状態確認

```javascript
// Chrome DevTools > Application > Service Workers
// キャッシュの確認
// Chrome DevTools > Application > Cache Storage

// コンソールでキャッシュ確認
caches.keys().then(console.log);
caches.open("garbage-rules-v1").then((cache) => cache.keys().then(console.log));
```

#### パフォーマンス測定

```typescript
// 検索パフォーマンス測定
export const searchGarbageItem = async (name: string) => {
  console.time("search");

  const allItems = await getGarbageItems();
  const fuse = new Fuse(allItems, {
    /* config */
  });
  const results = fuse.search(name);

  console.timeEnd("search");
  return results.map((result) => result.item);
};
```

## トラブルシューティング

### よくある問題と解決策

#### 1. キャッシュが更新されない

**原因:** キャッシュバージョンが変わっていない

**解決策:**

```javascript
// sw.js
const CACHE_NAME = "garbage-rules-v2"; // バージョンを上げる
```

#### 2. オフライン時に検索が動作しない

**原因:** データがキャッシュされていない

**解決策:**

```javascript
// 必要なデータを事前キャッシュ
const PRECACHE_URLS = ["/", "/api/garbage-items"];
```

#### 3. 検索が遅い

**原因:** Fuse インスタンスを毎回作成している

**解決策:** `useMemo`でインスタンスをキャッシュ

#### 4. メモリ不足エラー

**原因:** 大量データをメモリに保持

**解決策:** IndexedDB + ページネーション

## まとめ

### 現在の実装評価

✅ **適切な実装:**

- nuqs による URL 状態管理
- Service Worker による Cache First 戦略
- サーバーサイドでの Fuse.js 検索
- デバウンス処理

✅ **推奨事項:**

- データ量が少ない（数百〜数千件）なら現在の実装で十分
- nuqs は継続使用を推奨（URL 共有、SEO、ブックマーク対応）
- PWA キャッシュと nuqs は相性が良く、影響なし

⚠️ **今後の検討事項:**

- データ量が 5,000 件を超える場合: IndexedDB 検討
- クライアントサイド検索への移行が必要な場合: useMemo で最適化
- キャッシュの有効期限設定（現在は無期限）

---

**作成日:** 2025 年 11 月 6 日  
**プロジェクト:** garbage-rules  
**ブランチ:** pwa

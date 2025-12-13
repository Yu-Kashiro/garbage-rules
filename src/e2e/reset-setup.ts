import { test as setup } from "@playwright/test";

/**
 * リセットセットアップ
 * テスト実行前にテストデータをリセットする
 */
setup("リセットセットアップ", async ({ request }) => {
  // テストデータをリセットするAPIを呼び出す
  await request.post("/api/test/reset");
});

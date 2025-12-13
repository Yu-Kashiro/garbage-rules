import { test as setup, expect } from "@playwright/test";
import path from "path";

const authFile = path.join(__dirname, ".auth/user.json");

/**
 * 認証セットアップ
 * テスト実行前に一度だけ実行され、認証状態を保存する
 */
setup("認証セットアップ", async ({ page }) => {
  // ユニークなテストユーザーを作成
  const uniqueEmail = `test-e2e-${Date.now()}@example.com`;
  const password = "Password123!";

  // 新規登録ページに移動
  await page.goto("/signup");

  // フォームに入力
  await page.getByLabel("メールアドレス").fill(uniqueEmail);
  await page.getByLabel("パスワード").fill(password);

  // 新規登録ボタンをクリック
  await page.getByRole("button", { name: "新規登録" }).click();

  // 管理者画面にリダイレクトされるのを待つ
  await expect(page).toHaveURL("/admin", { timeout: 15000 });

  // 認証状態を保存
  await page.context().storageState({ path: authFile });
});

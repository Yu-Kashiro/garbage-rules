import { test, expect } from "@playwright/test";

test.describe("新規登録", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/signup");
  });

  test("新規登録ページが表示される", async ({ page }) => {
    await expect(page).toHaveTitle(/新規登録/);
    await expect(
      page.locator('[data-slot="card-title"]').filter({ hasText: "新規登録" })
    ).toBeVisible();
    await expect(page.getByLabel("メールアドレス")).toBeVisible();
    await expect(page.getByLabel("パスワード")).toBeVisible();
    await expect(page.getByRole("button", { name: "新規登録" })).toBeVisible();
  });

  test("バリデーションエラーが表示される（空の入力）", async ({ page }) => {
    await page.getByRole("button", { name: "新規登録" }).click();

    await expect(page.getByText("メールアドレスが不正です。")).toBeVisible();
    await expect(page.getByText("8文字以上で入力してください。")).toBeVisible();
  });

  test("バリデーションエラーが表示される（パスワードが短い）", async ({
    page,
  }) => {
    await page.getByLabel("メールアドレス").fill("test@example.com");
    await page.getByLabel("パスワード").fill("Pass1!");
    await page.getByRole("button", { name: "新規登録" }).click();

    await expect(page.getByText("8文字以上で入力してください。")).toBeVisible();
  });

  test("バリデーションエラーが表示される（パスワードに記号がない）", async ({
    page,
  }) => {
    await page.getByLabel("メールアドレス").fill("test@example.com");
    await page.getByLabel("パスワード").fill("Password123");
    await page.getByRole("button", { name: "新規登録" }).click();

    await expect(
      page.getByText(
        "大文字、小文字、数字、記号を含む半角英数字を入力してください。"
      )
    ).toBeVisible();
  });

  test("ランダムデータをセットボタンが動作する", async ({ page }) => {
    await page.getByRole("button", { name: "ランダムデータをセット" }).click();

    const emailInput = page.getByLabel("メールアドレス");
    const passwordInput = page.getByLabel("パスワード");

    await expect(emailInput).not.toHaveValue("");
    await expect(passwordInput).toHaveValue("Password123!");
  });

  test("新規登録が成功すると管理者画面にリダイレクトされる", async ({
    page,
  }) => {
    const uniqueEmail = `test${Date.now()}@example.com`;

    await page.getByLabel("メールアドレス").fill(uniqueEmail);
    await page.getByLabel("パスワード").fill("Password123!");
    await page.getByRole("button", { name: "新規登録" }).click();

    await expect(page).toHaveURL("/admin", { timeout: 15000 });
    await expect(
      page.getByRole("heading", { name: "管理者画面", level: 1 })
    ).toBeVisible();
  });
});

test.describe("ログイン", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("ログインページが表示される", async ({ page }) => {
    await expect(page).toHaveTitle(/ログイン/);
    await expect(
      page.locator('[data-slot="card-title"]').filter({ hasText: "ログイン" })
    ).toBeVisible();
    await expect(page.getByLabel("メールアドレス")).toBeVisible();
    await expect(page.getByLabel("パスワード")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "ログイン", exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "ゲストログイン" })
    ).toBeVisible();
  });

  test("バリデーションエラーが表示される（空の入力）", async ({ page }) => {
    await page.getByRole("button", { name: "ログイン", exact: true }).click();

    await expect(page.getByText("メールアドレスが不正です。")).toBeVisible();
    await expect(page.getByText("8文字以上で入力してください。")).toBeVisible();
  });

  test("ログインエラーが表示される（存在しないユーザー）", async ({ page }) => {
    await page.getByLabel("メールアドレス").fill("nonexistent@example.com");
    await page.getByLabel("パスワード").fill("Password123!");
    await page.getByRole("button", { name: "ログイン", exact: true }).click();

    await expect(
      page.getByText("メールアドレスまたはパスワードが間違っています。")
    ).toBeVisible({ timeout: 15000 });
  });

  test("ゲストログインが成功すると管理者画面にリダイレクトされる", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "ゲストログイン" }).click();

    await expect(page).toHaveURL("/admin", { timeout: 15000 });
    await expect(
      page.getByRole("heading", { name: "管理者画面", level: 1 })
    ).toBeVisible();
  });
});

test.describe("ログアウト", () => {
  test("ログアウトするとトップページにリダイレクトされる", async ({
    page,
  }) => {
    // ゲストログインで認証状態にする
    await page.goto("/login");
    await page.getByRole("button", { name: "ゲストログイン" }).click();
    await expect(page).toHaveURL("/admin", { timeout: 15000 });

    // ログアウト
    await page.getByRole("button", { name: "ログアウト" }).click();

    // トップページにリダイレクトされる
    await expect(page).toHaveURL("/", { timeout: 15000 });
    await expect(
      page.getByRole("heading", { name: "捨てたいごみを入力してください。" })
    ).toBeVisible();
  });

  test("ログアウト後は管理者画面にアクセスできない", async ({ page }) => {
    // ゲストログインで認証状態にする
    await page.goto("/login");
    await page.getByRole("button", { name: "ゲストログイン" }).click();
    await expect(page).toHaveURL("/admin", { timeout: 15000 });

    // ログアウト
    await page.getByRole("button", { name: "ログアウト" }).click();
    await expect(page).toHaveURL("/", { timeout: 15000 });

    // 管理者画面に直接アクセスしてもログインページにリダイレクトされる
    await page.goto("/admin");
    await expect(page).toHaveURL("/login", { timeout: 15000 });
  });
});

test.describe("ログイン後の動作", () => {
  test("新規登録後にログインできる", async ({ page }) => {
    const uniqueEmail = `test${Date.now()}@example.com`;
    const password = "Password123!";

    // 新規登録
    await page.goto("/signup");
    await page.getByLabel("メールアドレス").fill(uniqueEmail);
    await page.getByLabel("パスワード").fill(password);
    await page.getByRole("button", { name: "新規登録" }).click();

    await expect(page).toHaveURL("/admin", { timeout: 15000 });

    // ログアウト
    await page.getByRole("button", { name: "ログアウト" }).click();
    await expect(page).toHaveURL("/login", { timeout: 15000 });

    // ログイン
    await page.getByLabel("メールアドレス").fill(uniqueEmail);
    await page.getByLabel("パスワード").fill(password);
    await page.getByRole("button", { name: "ログイン", exact: true }).click();

    await expect(page).toHaveURL("/admin", { timeout: 15000 });
    await expect(
      page.getByRole("heading", { name: "管理者画面", level: 1 })
    ).toBeVisible();
  });

  test("ログイン中はログインページにアクセスできない", async ({ page }) => {
    // ゲストログインで認証状態にする
    await page.goto("/login");
    await page.getByRole("button", { name: "ゲストログイン" }).click();
    await expect(page).toHaveURL("/admin", { timeout: 15000 });

    // ログインページにアクセスしようとすると管理者画面にリダイレクトされる
    await page.goto("/login");
    await expect(page).toHaveURL("/admin", { timeout: 15000 });
  });

  test("ログイン中は新規登録ページにアクセスできない", async ({ page }) => {
    // ゲストログインで認証状態にする
    await page.goto("/login");
    await page.getByRole("button", { name: "ゲストログイン" }).click();
    await expect(page).toHaveURL("/admin", { timeout: 15000 });

    // 新規登録ページにアクセスしようとすると管理者画面にリダイレクトされる
    await page.goto("/signup");
    await expect(page).toHaveURL("/admin", { timeout: 15000 });
  });
});

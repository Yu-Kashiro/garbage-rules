import { test, expect } from '@playwright/test';

test.describe('分別区分の管理', () => {
  test.beforeEach(async ({ page }) => {
    // 認証済み状態で開始するため、直接遷移
    await page.goto('/admin/data/categories');
    await expect(page).toHaveURL('/admin/data/categories');
  });

  test('分別区分の管理ページが表示される', async ({ page }) => {
    await expect(page).toHaveTitle(/分別区分の管理/);
    await expect(page.getByRole('heading', { name: '分別区分の管理' })).toBeVisible();
    await expect(page.getByRole('button', { name: '新規登録' }).or(page.getByRole('button', { name: '+' }))).toBeVisible();
  });

  test('戻るボタンで管理者画面に戻れる', async ({ page }) => {
    await page.getByRole('link', { name: /戻る/ }).click();
    await expect(page).toHaveURL('/admin');
  });

  test.describe('新規登録', () => {
    test('新規登録ダイアログが開く', async ({ page }) => {
      await page.getByRole('button', { name: '新規登録' }).or(page.getByRole('button', { name: '+' })).click();

      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(page.getByRole('heading', { name: '分別区分の新規登録' })).toBeVisible();
      await expect(page.getByLabel('分別区分名')).toBeVisible();
      await expect(page.getByRole('button', { name: '登録' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'キャンセル' })).toBeVisible();
    });

    test('バリデーションエラーが表示される（空の入力）', async ({ page }) => {
      await page.getByRole('button', { name: '新規登録' }).or(page.getByRole('button', { name: '+' })).click();
      await page.getByRole('button', { name: '登録' }).click();

      await expect(page.getByText('分別区分名称は1文字以上入力してください')).toBeVisible();
    });

    test('新規登録が成功する', async ({ page }) => {
      const categoryName = `テスト分別区分${Date.now()}`;

      await page.getByRole('button', { name: '新規登録' }).or(page.getByRole('button', { name: '+' })).click();
      await page.getByLabel('分別区分名').fill(categoryName);
      await page.getByRole('button', { name: '登録' }).click();

      // 成功トーストが表示される
      await expect(page.getByText(`「${categoryName}」を登録しました`)).toBeVisible();
      // ダイアログが閉じる
      await expect(page.getByRole('dialog')).not.toBeVisible();
      // テーブルに新しい分別区分が表示される
      await expect(page.getByRole('cell', { name: categoryName })).toBeVisible();
    });

    test('キャンセルボタンでダイアログが閉じる', async ({ page }) => {
      await page.getByRole('button', { name: '新規登録' }).or(page.getByRole('button', { name: '+' })).click();
      await page.getByLabel('分別区分名').fill('キャンセルテスト');
      await page.getByRole('button', { name: 'キャンセル' }).click();

      await expect(page.getByRole('dialog')).not.toBeVisible();
    });
  });

  test.describe('編集・削除', () => {
    let categoryName: string;

    test.beforeEach(async ({ page }) => {
      // テスト用の分別区分を作成
      categoryName = `編集テスト${Date.now()}`;
      await page.getByRole('button', { name: '新規登録' }).or(page.getByRole('button', { name: '+' })).click();
      await page.getByLabel('分別区分名').fill(categoryName);
      await page.getByRole('button', { name: '登録' }).click();
      await expect(page.getByText(`「${categoryName}」を登録しました`)).toBeVisible();
    });

    test('編集ダイアログが開く', async ({ page }) => {
      // 作成した分別区分の行にある編集ボタンをクリック
      const row = page.getByRole('row').filter({ hasText: categoryName });
      await row.getByRole('button', { name: '編集' }).click();

      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(page.getByRole('heading', { name: '分別区分の編集' })).toBeVisible();
      await expect(page.getByLabel('分別区分名')).toHaveValue(categoryName);
      await expect(page.getByRole('button', { name: '更新' })).toBeVisible();
      await expect(page.getByRole('button', { name: '削除' })).toBeVisible();
    });

    test('分別区分を更新できる', async ({ page }) => {
      const updatedName = `更新後${Date.now()}`;

      const row = page.getByRole('row').filter({ hasText: categoryName });
      await row.getByRole('button', { name: '編集' }).click();

      await page.getByLabel('分別区分名').clear();
      await page.getByLabel('分別区分名').fill(updatedName);
      await page.getByRole('button', { name: '更新' }).click();

      // 成功トーストが表示される
      await expect(page.getByText(`「${categoryName}」を更新しました`)).toBeVisible();
      // ダイアログが閉じる
      await expect(page.getByRole('dialog')).not.toBeVisible();
      // テーブルに更新後の名前が表示される
      await expect(page.getByRole('cell', { name: updatedName })).toBeVisible();
    });

    test('削除確認ダイアログが表示される', async ({ page }) => {
      const row = page.getByRole('row').filter({ hasText: categoryName });
      await row.getByRole('button', { name: '編集' }).click();
      await page.getByRole('button', { name: '削除' }).click();

      // 確認ダイアログが表示される
      await expect(page.getByRole('alertdialog')).toBeVisible();
      await expect(page.getByText('本当に削除しますか?')).toBeVisible();
      await expect(page.getByText(`「${categoryName}」の「ごみ品目」も全て削除されます`)).toBeVisible();
    });

    test('削除をキャンセルできる', async ({ page }) => {
      const row = page.getByRole('row').filter({ hasText: categoryName });
      await row.getByRole('button', { name: '編集' }).click();
      await page.getByRole('button', { name: '削除' }).click();
      await page.getByRole('button', { name: 'キャンセル' }).click();

      // アラートダイアログが閉じる
      await expect(page.getByRole('alertdialog')).not.toBeVisible();
      // 編集ダイアログはまだ表示されている
      await expect(page.getByRole('dialog')).toBeVisible();
    });

    test('分別区分を削除できる', async ({ page }) => {
      const row = page.getByRole('row').filter({ hasText: categoryName });
      await row.getByRole('button', { name: '編集' }).click();
      await page.getByRole('button', { name: '削除' }).click();
      await page.getByRole('button', { name: '削除する' }).click();

      // 成功トーストが表示される
      await expect(page.getByText(`「${categoryName}」を削除しました`)).toBeVisible();
      // ダイアログが閉じる
      await expect(page.getByRole('dialog')).not.toBeVisible();
      // テーブルから削除された分別区分が消える
      await expect(page.getByRole('cell', { name: categoryName })).not.toBeVisible();
    });
  });
});

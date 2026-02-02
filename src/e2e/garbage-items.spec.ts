import { test, expect } from '@playwright/test';

test.describe('ごみ品目の管理', () => {
  let testCategoryName: string;

  test.beforeEach(async ({ page }) => {
    // 認証済み状態で開始するため、直接遷移
    // まず分別区分を作成（ごみ品目の登録に必要）
    await page.goto('/admin/data/categories');
    testCategoryName = `テストカテゴリ${Date.now()}`;
    await page.getByRole('button', { name: '新規登録' }).or(page.getByRole('button', { name: '+' })).click();
    await page.getByLabel('分別区分名').fill(testCategoryName);
    await page.getByRole('button', { name: '登録' }).click();
    await expect(page.getByText(`「${testCategoryName}」を登録しました`)).toBeVisible();

    // ごみ品目の管理ページへ移動
    await page.goto('/admin/data/items');
    await expect(page).toHaveURL('/admin/data/items');
  });

  test('ごみ品目の管理ページが表示される', async ({ page }) => {
    await expect(page).toHaveTitle(/ごみ品目の管理/);
    await expect(page.getByRole('heading', { name: 'ごみ品目の管理' })).toBeVisible();
    await expect(page.getByRole('button', { name: '新規登録' }).or(page.getByRole('button', { name: '+' }))).toBeVisible();
    // 検索フォームが表示される
    await expect(page.getByPlaceholder('例：バッテリー、エアコン...')).toBeVisible();
  });

  test('戻るボタンで管理者画面に戻れる', async ({ page }) => {
    await page.getByRole('link', { name: /戻る/ }).click();
    await expect(page).toHaveURL('/admin');
  });

  test.describe('新規登録', () => {
    test('新規登録ダイアログが開く', async ({ page }) => {
      await page.getByRole('button', { name: '新規登録' }).or(page.getByRole('button', { name: '+' })).click();

      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(page.getByRole('heading', { name: 'ごみ品目の新規登録' })).toBeVisible();
      await expect(page.getByLabel('品目名')).toBeVisible();
      await expect(page.getByLabel('分別区分')).toBeVisible();
      await expect(page.getByLabel('備考（任意）')).toBeVisible();
      await expect(page.getByLabel('検索キーワード（任意）')).toBeVisible();
      await expect(page.getByRole('button', { name: '登録' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'キャンセル' })).toBeVisible();
    });

    test('バリデーションエラーが表示される（空の入力）', async ({ page }) => {
      await page.getByRole('button', { name: '新規登録' }).or(page.getByRole('button', { name: '+' })).click();
      // 品目名を空のままにする
      await page.getByLabel('品目名').clear();
      await page.getByRole('button', { name: '登録' }).click();

      await expect(page.getByText('品目名は1文字以上入力してください')).toBeVisible();
    });

    test('新規登録が成功する', async ({ page }) => {
      const itemName = `テストごみ品目${Date.now()}`;

      await page.getByRole('button', { name: '新規登録' }).or(page.getByRole('button', { name: '+' })).click();
      await page.getByLabel('品目名').fill(itemName);
      // 分別区分を選択
      await page.getByLabel('分別区分').click();
      await page.getByRole('option', { name: testCategoryName }).click();
      await page.getByLabel('備考（任意）').fill('テスト用の備考です');
      await page.getByLabel('検索キーワード（任意）').fill('テスト キーワード');
      await page.getByRole('button', { name: '登録' }).click();

      // 成功トーストが表示される
      await expect(page.getByText(`「${itemName}」を登録しました`)).toBeVisible();
      // ダイアログが閉じる
      await expect(page.getByRole('dialog')).not.toBeVisible();
      // テーブルに新しいごみ品目が表示される
      await expect(page.getByRole('cell', { name: itemName })).toBeVisible();
    });

    test('キャンセルボタンでダイアログが閉じる', async ({ page }) => {
      await page.getByRole('button', { name: '新規登録' }).or(page.getByRole('button', { name: '+' })).click();
      await page.getByLabel('品目名').fill('キャンセルテスト');
      await page.getByRole('button', { name: 'キャンセル' }).click();

      await expect(page.getByRole('dialog')).not.toBeVisible();
    });
  });

  test.describe('編集・削除', () => {
    let itemName: string;

    test.beforeEach(async ({ page }) => {
      // テスト用のごみ品目を作成
      itemName = `編集テスト品目${Date.now()}`;
      await page.getByRole('button', { name: '新規登録' }).or(page.getByRole('button', { name: '+' })).click();
      await page.getByLabel('品目名').fill(itemName);
      await page.getByLabel('分別区分').click();
      await page.getByRole('option', { name: testCategoryName }).click();
      await page.getByRole('button', { name: '登録' }).click();
      await expect(page.getByText(`「${itemName}」を登録しました`)).toBeVisible();
    });

    test('編集ダイアログが開く', async ({ page }) => {
      // 作成したごみ品目の行にある編集ボタンをクリック
      const row = page.getByRole('row').filter({ hasText: itemName });
      await row.getByRole('button', { name: '編集' }).click();

      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(page.getByRole('heading', { name: 'ごみ品目の編集' })).toBeVisible();
      await expect(page.getByLabel('品目名')).toHaveValue(itemName);
      await expect(page.getByRole('button', { name: '更新' })).toBeVisible();
      await expect(page.getByRole('button', { name: '削除' })).toBeVisible();
    });

    test('ごみ品目を更新できる', async ({ page }) => {
      const updatedName = `更新後品目${Date.now()}`;

      const row = page.getByRole('row').filter({ hasText: itemName });
      await row.getByRole('button', { name: '編集' }).click();

      await page.getByLabel('品目名').clear();
      await page.getByLabel('品目名').fill(updatedName);
      await page.getByLabel('備考（任意）').fill('更新した備考');
      await page.getByRole('button', { name: '更新' }).click();

      // 成功トーストが表示される
      await expect(page.getByText(`「${itemName}」を更新しました`)).toBeVisible();
      // ダイアログが閉じる
      await expect(page.getByRole('dialog')).not.toBeVisible();
      // テーブルに更新後の名前が表示される
      await expect(page.getByRole('cell', { name: updatedName })).toBeVisible();
    });

    test('削除確認ダイアログが表示される', async ({ page }) => {
      const row = page.getByRole('row').filter({ hasText: itemName });
      await row.getByRole('button', { name: '編集' }).click();
      await page.getByRole('button', { name: '削除' }).click();

      // 確認ダイアログが表示される
      await expect(page.getByRole('alertdialog')).toBeVisible();
      await expect(page.getByText('本当に削除しますか?')).toBeVisible();
      await expect(page.getByText(`「${itemName}」を完全に削除します`)).toBeVisible();
    });

    test('削除をキャンセルできる', async ({ page }) => {
      const row = page.getByRole('row').filter({ hasText: itemName });
      await row.getByRole('button', { name: '編集' }).click();
      await page.getByRole('button', { name: '削除' }).click();
      await page.getByRole('button', { name: 'キャンセル' }).click();

      // アラートダイアログが閉じる
      await expect(page.getByRole('alertdialog')).not.toBeVisible();
      // 編集ダイアログはまだ表示されている
      await expect(page.getByRole('dialog')).toBeVisible();
    });

    test('ごみ品目を削除できる', async ({ page }) => {
      const row = page.getByRole('row').filter({ hasText: itemName });
      await row.getByRole('button', { name: '編集' }).click();
      await page.getByRole('button', { name: '削除' }).click();
      await page.getByRole('button', { name: '削除する' }).click();

      // 成功トーストが表示される
      await expect(page.getByText(`「${itemName}」を削除しました`)).toBeVisible();
      // ダイアログが閉じる
      await expect(page.getByRole('dialog')).not.toBeVisible();
      // テーブルから削除されたごみ品目が消える
      await expect(page.getByRole('cell', { name: itemName })).not.toBeVisible();
    });
  });

  test.describe('検索機能', () => {
    test.beforeEach(async ({ page }) => {
      // 検索テスト用のごみ品目を複数作成
      const items = [
        { name: `ペットボトル${Date.now()}`, search: 'プラスチック PET' },
        { name: `新聞紙${Date.now()}`, search: 'しんぶんし 紙類' },
        { name: `空き缶${Date.now()}`, search: 'あきかん アルミ スチール' },
      ];

      for (const item of items) {
        await page.getByRole('button', { name: '新規登録' }).or(page.getByRole('button', { name: '+' })).click();
        await page.getByLabel('品目名').fill(item.name);
        await page.getByLabel('分別区分').click();
        await page.getByRole('option', { name: testCategoryName }).click();
        await page.getByLabel('検索キーワード（任意）').fill(item.search);
        await page.getByRole('button', { name: '登録' }).click();
        await expect(page.getByText(`「${item.name}」を登録しました`)).toBeVisible();
      }
    });

    test('品目名で検索できる', async ({ page }) => {
      const searchInput = page.getByPlaceholder('例：バッテリー、エアコン...');
      await searchInput.fill('ペットボトル');

      // 検索結果が表示される（少し待つ）
      await page.waitForTimeout(500);
      await expect(page.getByRole('cell', { name: /ペットボトル/ }).first()).toBeVisible();
    });

    test('検索キーワードで検索できる', async ({ page }) => {
      const searchInput = page.getByPlaceholder('例：バッテリー、エアコン...');
      await searchInput.fill('アルミ');

      // 検索結果が表示される（少し待つ）
      await page.waitForTimeout(500);
      await expect(page.getByRole('cell', { name: /空き缶/ }).first()).toBeVisible();
    });

    test('検索結果が0件の場合メッセージが表示される', async ({ page }) => {
      const searchInput = page.getByPlaceholder('例：バッテリー、エアコン...');
      await searchInput.fill('存在しない品目名XYZ');

      // 検索結果が0件のメッセージが表示される
      await page.waitForTimeout(500);
      await expect(page.getByText('品目名が見つかりませんでした')).toBeVisible();
    });

    test('検索をクリアすると全件表示される', async ({ page }) => {
      const searchInput = page.getByPlaceholder('例：バッテリー、エアコン...');

      // まず検索
      await searchInput.fill('ペットボトル');
      await page.waitForTimeout(500);

      // 検索をクリア
      await searchInput.clear();
      await page.waitForTimeout(500);

      // 全てのアイテムが表示される
      await expect(page.getByRole('cell', { name: /ペットボトル/ }).first()).toBeVisible();
      await expect(page.getByRole('cell', { name: /新聞紙/ }).first()).toBeVisible();
      await expect(page.getByRole('cell', { name: /空き缶/ }).first()).toBeVisible();
    });
  });
});

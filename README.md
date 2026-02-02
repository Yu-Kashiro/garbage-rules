# ゴミ分別方法検索アプリケーション

捨てたいゴミを入力すると、分別方法を検索できます。

## 技術スタック

- Next.js 16
- React 19
- Tailwind CSS 4
- shadcn/ui
- Drizzle ORM
- Turso(libSQL)
- better-auth
- Zod
- Fuse.js

## セットアップ

```bash
pnpm install
```

## 開発

```bash
pnpm dev
```

## ビルド

```bash
pnpm build
```

## データベース

マイグレーション実行:

```bash
pnpm drizzle:migrate
```

シードデータ投入:

```bash
pnpm seed:categories
pnpm seed:items
```

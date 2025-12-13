
import { db } from "@/db";
import { garbageCategories, garbageItems } from "@/db/schemas/garbage";
import { NextResponse } from "next/server";

/**
 * テストデータをリセットするAPI
 * E2Eテスト実行前にデータをクリーンアップする
 */
export async function POST() {
  // 本番環境では実行しない
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "本番環境では実行できません" },
      { status: 403 }
    );
  }

  try {
    // 外部キー制約があるため、garbageItemsを先に削除
    await db.delete(garbageItems);
    await db.delete(garbageCategories);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("テストデータのリセットに失敗しました", error);
    return NextResponse.json(
      { error: "テストデータのリセットに失敗しました" },
      { status: 500 }
    );
  }
}

import { getGarbageItems } from "@/data/garbage";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const items = await getGarbageItems();
    return NextResponse.json(items);
  } catch (error) {
    console.error("ごみ品目一覧の取得に失敗しました:", error);
    return NextResponse.json(
      { error: "ごみ品目一覧の取得に失敗しました" },
      { status: 500 }
    );
  }
}

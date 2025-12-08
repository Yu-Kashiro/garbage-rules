import { getGarbageItems } from "@/data/garbage";
import { getCacheVersion } from "@/data/cache";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [items, version] = await Promise.all([
      getGarbageItems(),
      getCacheVersion(),
    ]);

    return NextResponse.json(items, {
      headers: {
        "X-Cache-Version": version.toString(),
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("ごみ品目一覧の取得に失敗しました:", error);
    return NextResponse.json(
      { error: "ごみ品目一覧の取得に失敗しました" },
      { status: 500 }
    );
  }
}

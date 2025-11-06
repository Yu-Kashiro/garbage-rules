import { getGarbageItems } from "@/data/garbage";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const items = await getGarbageItems();
    return NextResponse.json(items);
  } catch (error) {
    console.error("Failed to fetch garbage items:", error);
    return NextResponse.json(
      { error: "Failed to fetch garbage items" },
      { status: 500 }
    );
  }
}

import { db } from "@/db";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { garbageCategories, garbageItems } from "@/db/schemas/garbages";
import { GarbageItemWithCategory } from "@/types/garbage";
import { eq } from "drizzle-orm";

async function getData(): Promise<GarbageItemWithCategory[]> {
  const result = await db
    .select()
    .from(garbageItems)
    .innerJoin(garbageCategories, eq(garbageItems.garbageCategory, garbageCategories.id));

  // フラットな構造にマップし、カテゴリIDをカテゴリ名に変換
  return result.map((row) => ({
    id: row.garbage_Items.id,
    name: row.garbage_Items.name,
    garbageCategory: row.garbage_categories.name,
    note: row.garbage_Items.note,
    createdAt: row.garbage_Items.createdAt,
    updatedAt: row.garbage_Items.updatedAt,
  }));
}

export default async function SearchGarbage() {
  const data = await getData();

  return (
    <div className="">
      <DataTable columns={columns} data={data} />
    </div>
  );
}

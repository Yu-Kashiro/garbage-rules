import { CreateItemButton } from "@/components/forms/create-item-button";
import { GarbageItemTable } from "@/components/forms/garbage-item-table";
import { Button } from "@/components/ui/button";
import { getGarbageCategories, getGarbageItemsWithId } from "@/data/garbage";
import Link from "next/link";

export default async function ItemEditPage() {
  const [items, categories] = await Promise.all([
    getGarbageItemsWithId(),
    getGarbageCategories(),
  ]);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="relative flex items-center justify-between">
            <div className="flex justify-start">
              <Link href="/admin">
                <Button variant="outline">
                  ←<span className="hidden md:inline"> 戻る</span>
                </Button>
              </Link>
            </div>
            <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-bold md:text-3xl whitespace-nowrap">
              ごみ品目の管理
            </h1>
            <div className="flex justify-end">
              <CreateItemButton categories={categories} />
            </div>
          </div>
        </div>

        <GarbageItemTable items={items} categories={categories} />
      </div>
    </div>
  );
}

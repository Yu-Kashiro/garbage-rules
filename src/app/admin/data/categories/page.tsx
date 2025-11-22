import { CreateCategoryButton } from "@/components/forms/create-category-button";
import { GarbageCategoryTable } from "@/components/forms/garbage-category-table";
import { Button } from "@/components/ui/button";
import { getGarbageCategories } from "@/data/garbage";
import Link from "next/link";

export default async function CategoryEditPage() {
  const categories = await getGarbageCategories();

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="relative flex items-center justify-between">
            <div className="flex justify-start">
              <Button variant="outline" asChild>
                <Link href="/admin">
                  ←<span className="hidden md:inline"> 戻る</span>
                </Link>
              </Button>
            </div>
            <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-bold md:text-3xl whitespace-nowrap">
              分別区分の管理
            </h1>
            <div className="flex justify-end">
              <CreateCategoryButton />
            </div>
          </div>
        </div>

        <GarbageCategoryTable categories={categories} />
      </div>
    </div>
  );
}

import { GarbageCategoryEditDialog } from "@/components/admin/garbage-category-edit-dialog";
import { GarbageCategoryTable } from "@/components/admin/garbage-category-table";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "分別区分の管理",
};

export default function CategoryEditPage() {
  return (
    <div className="container py-10">
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
              <GarbageCategoryEditDialog />
            </div>
          </div>
        </div>

        <GarbageCategoryTable />
      </div>
    </div>
  );
}

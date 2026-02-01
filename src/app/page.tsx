import { GarbageItemsTable } from "@/components/garbage-items-table";
import { SearchForm } from "@/components/search-form";
import Image from "next/image";
import { Suspense } from "react";

export default function GarbageRulesPage() {
  return (
    <main className="flex flex-1 bg-[#fafafa] pt-4 md:pt-10">
      <div className="container max-w-3xl space-y-5">
        {/* ヘッダーセクション（フェードインアニメーション） */}
        <div className="text-center space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex justify-center mb-3">
            <Image
              src="/images/recycle-bag.svg"
              alt="リサイクル"
              width={100}
              height={100}
            />
          </div>
          <h1 className="text-xl font-bold md:text-3xl text-foreground">
            捨てたいごみを入力してください。
          </h1>
          <p className="text-sm text-muted-foreground">
            品目名を入力して分別方法を検索できます
          </p>
        </div>

        {/* 検索フォームエリア */}
        <div className="sticky top-14 z-10 pb-2 md:pb-6 pt-2">
          <Suspense>
            <SearchForm />
          </Suspense>
        </div>

        <Suspense>
          <GarbageItemsTable />
        </Suspense>
      </div>
    </main>
  );
}

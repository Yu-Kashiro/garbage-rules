import { GarbageItemsTable } from "@/components/garbage-items-table";
import { SearchForm } from "@/components/search-form";
import { Suspense } from "react";

export default function GarbageRulesPage() {
  return (
    <main className="flex flex-1 items-start justify-center bg-background-main pt-4 md:pt-10">
      <div className="container max-w-3xl px-2 md:px-4 space-y-5 md:space-y-10">
        <h1 className="text-center text-xl font-bold md:text-3xl">
          捨てたいごみを入力してください。
        </h1>

        <div className="sticky top-14 z-10 bg-background-main pb-2 md:pb-6 pt-2">
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

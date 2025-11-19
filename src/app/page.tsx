import { GarbageItemsTable } from "@/components/garbage-items-table";
import { SearchForm } from "@/components/search-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getGarbageItems } from "@/data/garbage";
import { Suspense } from "react";

export default async function GarbageRulesPage() {
  const garbageItems = await getGarbageItems();

  return (
    <ScrollArea className="border rounded-md h-content">
      <main className="flex items-start justify-center bg-background-main pt-10 md:pt-10">
        <div className="container max-w-3xl px-4 space-y-10">
          <h1 className="text-center text-xl font-bold md:text-3xl">
            捨てたいごみを入力してください。
          </h1>

          <Suspense>
            <SearchForm />
            <GarbageItemsTable items={garbageItems} />
          </Suspense>
        </div>
      </main>
    </ScrollArea>
  );
}

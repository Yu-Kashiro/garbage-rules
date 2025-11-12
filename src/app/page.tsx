"use client";

import { SearchResults } from "@/components/search-results";
import { Input } from "@/components/ui/input";
import { useQueryState } from "nuqs";
import { Suspense } from "react";

function SearchTable() {
  const [name, setName] = useQueryState("name", {
    defaultValue: "",
  });

  return (
    <>
      <Input
        value={name}
        placeholder="例：バッテリー、水筒、茶碗..."
        onChange={(e) => setName(e.target.value)}
      />
      <SearchResults name={name} />
    </>
  );
}

export default function Home() {
  return (
    <main className="flex h-content items-start justify-center bg-background-main pt-10 md:pt-10">
      <div className="container max-w-3xl px-4 space-y-10">
        <h1 className="text-center text-xl font-bold md:text-4xl">
          捨てたいごみを入力してください。
        </h1>

        <Suspense fallback={<div>読み込み中...</div>}>
          <SearchTable />
        </Suspense>
      </div>
    </main>
  );
}

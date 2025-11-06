"use client";

import { GarbageSearchForm } from "@/components/garbage-search-form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGarbageSearch } from "@/hooks/use-garbage-search";
import { useQueryState } from "nuqs";
import { Suspense } from "react";

function SearchResults({ name }: { name: string }) {
  const { results, loading, error } = useGarbageSearch(name);

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (error) {
    return <div>エラーが発生しました: {error.message}</div>;
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>品目名</TableHead>
            <TableHead>分別区分</TableHead>
            <TableHead>備考</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((garbage) => (
            <TableRow key={garbage.id}>
              <TableCell>{garbage.name}</TableCell>
              <TableCell>{garbage.garbageCategory}</TableCell>
              <TableCell>{garbage.note}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function Home() {
  const [name] = useQueryState("name", {
    defaultValue: "",
    shallow: true,
  });

  return (
    <main className="flex flex-1 items-start justify-center bg-background-main pt-10 md:pt-10">
      <div className="container max-w-3xl px-4 space-y-10">
        <h1 className="text-center text-xl font-bold md:text-4xl">
          捨てたいごみを入力してください。
        </h1>

        <GarbageSearchForm />

        <Suspense fallback={<div>読み込み中...</div>}>
          <SearchResults name={name} />
        </Suspense>
      </div>
    </main>
  );
}

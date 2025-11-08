"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGarbageSearch } from "@/hooks/use-garbage-search";

export function SearchResults({ name }: { name: string }) {
  const { results, loading, error } = useGarbageSearch(name);

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (error) {
    return <div>エラーが発生しました: {error.message}</div>;
  }

  if (results.length === 0) {
    return (
      <div className="border rounded-md p-8 text-center text-muted-foreground">
        検索結果が見つかりませんでした
      </div>
    );
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

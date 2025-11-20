"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCacheData, setCacheData } from "@/lib/cache-client";
import { GarbageItemWithCategory } from "@/types/garbage";
import { useQueryState } from "nuqs";
import { useEffect, useMemo, useState } from "react";

export function GarbageItemsTable() {
  const [search] = useQueryState("q", {
    defaultValue: "",
  });
  const [items, setItems] = useState<GarbageItemWithCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGarbageItems = async () => {
      try {
        // まずキャッシュからデータを取得
        const cachedData = await getCacheData<GarbageItemWithCategory[]>(
          "/api/garbage-items"
        );

        if (cachedData) {
          // キャッシュにデータがあれば使用
          setItems(cachedData);
          setIsLoading(false);
          return;
        }

        // キャッシュにデータがない場合はAPIからフェッチ
        const response = await fetch("/api/garbage-items");
        if (!response.ok) {
          throw new Error("データの取得に失敗しました");
        }

        const data = await response.json();

        // データをstateとキャッシュに保存
        setItems(data);
        await setCacheData("/api/garbage-items", data);
      } catch (error) {
        console.error("ごみ品目一覧の取得に失敗しました:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGarbageItems();
  }, []);

  const filteredGarbageItems = useMemo(() => {
    return items?.filter((garbageItem) => garbageItem.name.includes(search));
  }, [items, search]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-muted-foreground">読み込み中...</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>品目名</TableHead>
          <TableHead>分別区分</TableHead>
          <TableHead>備考</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredGarbageItems?.map((garbageItem) => (
          <TableRow key={garbageItem.id}>
            <TableCell>{garbageItem.name}</TableCell>
            <TableCell>{garbageItem.garbageCategory}</TableCell>
            <TableCell>{garbageItem.note}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { GarbageCategory, GarbageItem } from "@/types/garbage";
import { GarbageItemEditDialog } from "./garbage-item-edit-dialog";
import { useQueryState } from "nuqs";
import Fuse from "fuse.js";

export function GarbageItemsEditTable({
  items,
  categories,
}: {
  items: GarbageItem[];
  categories: GarbageCategory[];
}) {
  const [search] = useQueryState("q", {
    defaultValue: "",
  });

  // カテゴリIDから名前を取得
  const getCategoryName = (categoryId: number) => {
    return categories.find((c) => c.id === categoryId)?.name || "不明";
  };

  // Fuse.jsの設定とインスタンス作成
  const searchableItems = items.map((item) => ({
    ...item,
    categoryName: getCategoryName(item.garbageCategory),
  }));

  const fuse = new Fuse(searchableItems, {
    keys: [
      { name: "name", weight: 2 }, // 品目名を重視
      { name: "search", weight: 1 },
      { name: "note", weight: 1 },
    ],
    threshold: 0.4, // 0.0 (完全一致) ~ 1.0 (すべてマッチ)
    ignoreLocation: true, // 文字列内の位置を無視
    minMatchCharLength: 1,
  });

  // 検索フィルタリング
  const filteredItems = search
    ? fuse.search(search).map((result) => result.item)
    : items;

  if (items.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        登録されているごみ品目がありません
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">番号</TableHead>
            <TableHead>品目名</TableHead>
            <TableHead>分別区分</TableHead>
            <TableHead className="hidden md:table-cell">備考</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredItems.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-8 text-muted-foreground"
              >
                品目名が見つかりませんでした
              </TableCell>
            </TableRow>
          ) : (
            filteredItems.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="truncate max-w-[200px]" title={item.name}>
                  {item.name}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {getCategoryName(item.garbageCategory)}
                </TableCell>
                <TableCell
                  className="hidden md:table-cell truncate max-w-[200px]"
                  title={item.note || ""}
                >
                  {item.note || "-"}
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <GarbageItemEditDialog item={item} categories={categories} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

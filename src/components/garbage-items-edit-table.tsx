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

export function GarbageItemsEditTable({
  items,
  categories,
}: {
  items: GarbageItem[];
  categories: GarbageCategory[];
}) {
  // カテゴリIDから名前を取得
  const getCategoryName = (categoryId: number) => {
    return categories.find((c) => c.id === categoryId)?.name || "不明";
  };

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
          {items.map((item, index) => (
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

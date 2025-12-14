"use client";

import { Button } from "@/components/ui/button";
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
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

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
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // スクロール位置を監視
  useEffect(() => {
    const handleScroll = () => {
      // 300px以上スクロールしたらボタンを表示
      setShowScrollToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // トップへスクロールする関数
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

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
    <>
      <div className="rounded-md border overflow-x-auto">
        <Table className="table-fixed w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[10%]">番号</TableHead>
              <TableHead className="w-[30%]">品目名</TableHead>
              <TableHead className="hidden md:table-cell md:w-[20%]">
                分別区分
              </TableHead>
              <TableHead className="hidden md:table-cell md:w-[30%]">
                備考
              </TableHead>
              <TableHead className="w-[10%]"></TableHead>
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
                  <TableCell className="font-medium w-[10%]">
                    {index + 1}
                  </TableCell>
                  <TableCell
                    className="truncate max-w-0 w-[30%]"
                    title={item.name}
                  >
                    {item.name}
                  </TableCell>
                  <TableCell
                    className="hidden md:table-cell truncate max-w-0 md:w-[20%]"
                    title={getCategoryName(item.garbageCategory)}
                  >
                    {getCategoryName(item.garbageCategory)}
                  </TableCell>
                  <TableCell
                    className="hidden md:table-cell truncate max-w-0 md:w-[30%]"
                    title={item.note || ""}
                  >
                    {item.note || "-"}
                  </TableCell>
                  <TableCell className="text-right w-[10%]">
                    <GarbageItemEditDialog
                      item={item}
                      categories={categories}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* トップへ戻るボタン */}
      <Button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 h-12 w-12 rounded-full transition-opacity duration-300 ${
          showScrollToTop ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        size="icon"
        aria-label="トップへ戻る"
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
    </>
  );
}

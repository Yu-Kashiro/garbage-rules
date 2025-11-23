"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCacheData, setCacheData } from "@/lib/cache-client";
import { getCategoryStyle } from "@/lib/category-styles";
import { garbageFuseOptions } from "@/lib/fuse-config";
import { GarbageItemWithCategory } from "@/types/garbage";
import Fuse from "fuse.js";
import { ArrowUp, Info } from "lucide-react";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";

export function GarbageItemsTable() {
  const [search] = useQueryState("q", {
    defaultValue: "",
  });
  const [items, setItems] = useState<GarbageItemWithCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

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

  // const filteredGarbageItems = useMemo(() => {
  //   if (!search) {
  //     // 検索クエリが空の場合は全件表示
  //     return items;
  //   }
  //   // 検索クエリがある場合はFuse.jsで検索
  //   const fuse = new Fuse(items, garbageFuseOptions);
  //   return fuse.search(search).map((result) => result.item);
  // }, [items, search]);

  // 再レンダリングのたびに実行される
  const fuse = new Fuse(items, garbageFuseOptions);
  const filteredGarbageItems = search
    ? fuse.search(search).map((result) => result.item)
    : items;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-muted-foreground">読み込み中...</p>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="border w-[50%] text-center">
                品目名
              </TableHead>
              <TableHead className="border w-[41%] text-center">
                分別区分
              </TableHead>
              <TableHead className="border w-[9%]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGarbageItems.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="border text-center py-8 text-muted-foreground"
                >
                  品目名が見つかりませんでした
                </TableCell>
              </TableRow>
            ) : (
              filteredGarbageItems.map((garbageItem) => (
                <TableRow key={garbageItem.id}>
                  <TableCell className="border truncate">
                    {garbageItem.name}
                  </TableCell>
                  <TableCell className="border">
                    <Badge
                      variant={
                        getCategoryStyle(garbageItem.garbageCategory).variant
                      }
                      className={`${
                        getCategoryStyle(garbageItem.garbageCategory).className
                      } max-w-full truncate`}
                    >
                      {garbageItem.garbageCategory}
                    </Badge>
                  </TableCell>
                  <TableCell className="border text-center">
                    {garbageItem.note ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-auto w-auto p-0"
                            aria-label="備考を表示"
                          >
                            <Info className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="[&>button[data-slot='dialog-close']]:top-2">
                          <DialogHeader>
                            <DialogTitle>{garbageItem.name}</DialogTitle>
                            <DialogDescription className="text-left whitespace-pre-wrap">
                              {garbageItem.note}
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
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
        className={`fixed bottom-8 right-8 z-50 h-12 w-12 rounded-full shadow-lg transition-opacity duration-300 ${
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

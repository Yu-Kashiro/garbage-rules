"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { wasteTypeIcons } from "@/lib/waste-type-icons";
import { getCacheData, setCacheData } from "@/lib/cache-client";
import { garbageFuseOptions } from "@/lib/fuse-config";
import { GarbageItemWithCategory } from "@/types/garbage";
import Fuse from "fuse.js";
import { ArrowUp } from "lucide-react";
import { useQueryState } from "nuqs";
import { useEffect, useRef, useState } from "react";

function GarbageItemRow({
  garbageItem,
}: {
  garbageItem: GarbageItemWithCategory;
}) {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  // 品目名が省略されているかどうかを判定
  useEffect(() => {
    const element = textRef.current;
    if (element) {
      setIsTruncated(element.scrollWidth > element.clientWidth);
    }
  }, []);

  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b hover:bg-muted/30 transition-colors">
      {/* 品目名 */}
      <div className="flex flex-col gap-2 min-w-0 flex-1">
        <div className="flex items-center gap-2 min-w-0">
          <Popover>
            <PopoverTrigger asChild>
              <span
                ref={textRef}
                className="font-medium text-base truncate cursor-pointer"
                style={{
                  cursor: isTruncated ? "pointer" : "default",
                }}
              >
                {garbageItem.name}
              </span>
            </PopoverTrigger>
            {isTruncated && (
              <PopoverContent
                className="w-auto max-w-md p-3"
                side="top"
                align="start"
              >
                <p className="font-medium">{garbageItem.name}</p>
              </PopoverContent>
            )}
          </Popover>
        </div>
        {garbageItem.note && (
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {garbageItem.note}
          </p>
        )}
      </div>

      {/* 分別区分 */}
      {(() => {
        const Icon = wasteTypeIcons[garbageItem.garbageCategory];
        return (
          <Badge
            variant="outline"
            className="whitespace-nowrap py-1.5 px-3 font-normal rounded-full shrink-0 border-2 text-foreground"
            style={{
              borderColor: garbageItem.categoryColor,
              backgroundColor: "transparent",
            }}
          >
            <span className="flex items-center gap-1.5">
              {Icon && <Icon className="h-4 w-4" />}
              {garbageItem.garbageCategory}
            </span>
          </Badge>
        );
      })()}
    </div>
  );
}

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
        const cachedData =
          await getCacheData<GarbageItemWithCategory[]>("/api/garbage-items");

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

        const data = (await response.json()) as GarbageItemWithCategory[];

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

  // Fuse.jsで検索
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
      {/* テーブル */}
      <div className="divide-y">
        {filteredGarbageItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            品目名が見つかりませんでした
          </div>
        ) : (
          filteredGarbageItems.map((garbageItem) => (
            <GarbageItemRow key={garbageItem.id} garbageItem={garbageItem} />
          ))
        )}
      </div>

      {/* トップへ戻るボタン */}
      <Button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 lg:right-[max(2rem,calc((100vw-48rem)/2-4rem))] z-50 h-12 w-12 rounded-full transition-opacity duration-300 ${
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

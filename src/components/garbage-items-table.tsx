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
import Image from "next/image";
import { useQueryState } from "nuqs";
import { useEffect, useRef, useState } from "react";

function GarbageItemCard({
  garbageItem,
}: {
  garbageItem: GarbageItemWithCategory;
}) {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const element = textRef.current;
    if (element) {
      setIsTruncated(element.scrollWidth > element.clientWidth);
    }
  }, []);

  const Icon = wasteTypeIcons[garbageItem.garbageCategory];

  return (
    <div
      className="group relative bg-card rounded-xl border border-border shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-primary/50"
    >
      {/* 左端のカテゴリカラーアクセントライン */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 group-hover:w-1.5"
        style={{ backgroundColor: garbageItem.categoryColor }}
      />

      <div className="flex items-center justify-between gap-4 p-4 pl-5">
        {/* 品目名 */}
        <div className="flex flex-col gap-2 min-w-0 flex-1">
          <div className="flex items-center gap-2 min-w-0">
            <Popover>
              <PopoverTrigger asChild>
                <span
                  ref={textRef}
                  className="font-semibold text-base truncate cursor-pointer text-card-foreground"
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

        {/* 分別区分（アイコン強調） */}
        <div className="flex items-center gap-2 shrink-0">
          {Icon && (
            <div
              className="flex items-center justify-center h-12 w-12 rounded-xl transition-transform duration-300 group-hover:scale-110"
              style={{
                backgroundColor: `${garbageItem.categoryColor}15`,
              }}
            >
              <Icon
                className="h-7 w-7"
                style={{ color: garbageItem.categoryColor }}
              />
            </div>
          )}
          <Badge
            variant="outline"
            className="whitespace-nowrap py-2 px-4 text-sm font-semibold rounded-full border-2 text-foreground"
            style={{
              borderColor: garbageItem.categoryColor,
              backgroundColor: "transparent",
            }}
          >
            {garbageItem.garbageCategory}
          </Badge>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden animate-pulse">
      <div className="flex items-center justify-between gap-4 p-4 pl-5">
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-5 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-muted rounded-lg" />
          <div className="h-7 w-20 bg-muted rounded-full" />
        </div>
      </div>
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
        const cachedData =
          await getCacheData<GarbageItemWithCategory[]>("/api/garbage-items");

        if (cachedData) {
          setItems(cachedData);
          setIsLoading(false);
          return;
        }

        const response = await fetch("/api/garbage-items");
        if (!response.ok) {
          throw new Error("データの取得に失敗しました");
        }

        const data = (await response.json()) as GarbageItemWithCategory[];

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

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const fuse = new Fuse(items, garbageFuseOptions);
  const filteredGarbageItems = search
    ? fuse.search(search).map((result) => result.item)
    : items;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {[...Array(5)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <>
      {/* カードリスト */}
      <div className="flex flex-col gap-3">
        {filteredGarbageItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-card rounded-xl border border-border">
            <Image
              src="/images/thinking-face.svg"
              alt="考える顔"
              width={140}
              height={140}
              className="mb-4"
            />
            <p className="text-muted-foreground">
              該当する品目が見つかりませんでした
            </p>
          </div>
        ) : (
          filteredGarbageItems.map((garbageItem) => (
            <GarbageItemCard
              key={garbageItem.id}
              garbageItem={garbageItem}
            />
          ))
        )}
      </div>

      {/* トップへ戻るボタン */}
      <Button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 lg:right-[max(2rem,calc((100vw-48rem)/2-4rem))] z-50 h-12 w-12 rounded-full shadow-lg transition-all duration-300 ${
          showScrollToTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        size="icon"
        aria-label="トップへ戻る"
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
    </>
  );
}

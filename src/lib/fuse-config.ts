import type { IFuseOptions } from "fuse.js";
import type { GarbageItemWithCategory } from "@/types/garbage";

export const garbageFuseOptions: IFuseOptions<GarbageItemWithCategory> = {
  keys: ["name", "note"], // 名前と備考を検索対象に
  threshold: 0.3, // 0.3の閾値で適度なあいまい検索
  distance: 100,
  minMatchCharLength: 1,
  includeScore: true,
};

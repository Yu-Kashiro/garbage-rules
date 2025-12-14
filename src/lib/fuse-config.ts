import type { IFuseOptions } from "fuse.js";
import type { GarbageItem, GarbageItemWithCategory } from "@/types/garbage";

// 共通のFuse.js設定
const baseFuseOptions = {
  keys: ["name", "note", "search"],
  threshold: 0.3,
  distance: 100,
  minMatchCharLength: 1,
  includeScore: true,
};

// ユーザー向け表示用（GarbageItemWithCategory型）
export const garbageFuseOptions: IFuseOptions<GarbageItemWithCategory> = {
  ...baseFuseOptions,
};

// 管理画面編集用（GarbageItem型）
export const garbageItemFuseOptions: IFuseOptions<GarbageItem> = {
  ...baseFuseOptions,
};

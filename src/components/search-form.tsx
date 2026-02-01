"use client";

import { Input } from "./ui/input";
import { useQueryState } from "nuqs";
import { Search, X } from "lucide-react";

export function SearchForm() {
  const [search, setSearch] = useQueryState("q", {
    defaultValue: "",
  });

  return (
    <div className="relative">
      {/* 左側の検索アイコン */}
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
      <Input
        type="text"
        placeholder="例：バッテリー、エアコン..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="h-11 pl-12 pr-10 rounded-xl border-2 border-input focus:border-primary transition-colors"
      />
      {/* クリアボタン（フェードインアニメーション付き） */}
      {search && (
        <button
          type="button"
          onClick={() => setSearch("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all duration-200 animate-in fade-in"
          aria-label="検索をクリア"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

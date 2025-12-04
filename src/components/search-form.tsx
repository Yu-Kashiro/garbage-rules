"use client";

import { Input } from "./ui/input";
import { useQueryState } from "nuqs";
import { X } from "lucide-react";

export function SearchForm() {
  const [search, setSearch] = useQueryState("q", {
    defaultValue: "",
  });

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="例：バッテリー、エアコン..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="pr-10"
      />
      {search && (
        <button
          type="button"
          onClick={() => setSearch("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="検索をクリア"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

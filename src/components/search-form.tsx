"use client"

import { Input } from "./ui/input";
import { useQueryState } from "nuqs"

export function SearchForm() {
  const [search, setSearch] = useQueryState("q", {
    defaultValue: "",
  })
  
  return (
    <Input
      type="text"
      placeholder="例：バッテリー、かばん、ペットボトル..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}

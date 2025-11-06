"use client";

import { useQueryState } from "nuqs";
import { Input } from "./ui/input";

export function GarbageSearchForm() {
  const [name, setName] = useQueryState("name", {
    defaultValue: "",
    shallow: true,
  });

  return (
    <div>
      <Input
        value={name}
        placeholder="例：バッテリー、水筒、茶碗..."
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  );
}

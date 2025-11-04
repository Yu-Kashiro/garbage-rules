"use client"

import { debounce, useQueryState } from "nuqs";
import { Input } from "./ui/input";

export function GarbageSearchForm() {
  const [name, setName] = useQueryState("name", {
    defaultValue: "",
    shallow: false,
  });

  return (
    <div>
      <Input
        value={name}
        placeholder="例：バッテリー、水筒、茶碗..."
        onChange={(e) =>
          setName(e.target.value, {
            limitUrlUpdates: e.target.value === "" ? undefined : debounce(50),
          })
        }
      />
    </div>
  );
}

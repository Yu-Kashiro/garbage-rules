"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GarbageItemWithCategory } from "@/types/garbage";
import { useQueryState } from "nuqs";
import { useMemo } from "react";

export function GarbageItemsTable({
  items,
}: {
  items: GarbageItemWithCategory[];
}) {
  const [search] = useQueryState("q", {
    defaultValue: "",
  });

  const filteredGarbageItems = useMemo(() => {
    return items?.filter((garbageItem) => garbageItem.name.includes(search));
  }, [items, search]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>品目名</TableHead>
          <TableHead>分別区分</TableHead>
          <TableHead>備考</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredGarbageItems?.map((garbageItem) => (
          <TableRow key={garbageItem.id}>
            <TableCell>{garbageItem.name}</TableCell>
            <TableCell>{garbageItem.garbageCategory}</TableCell>
            <TableCell>{garbageItem.note}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

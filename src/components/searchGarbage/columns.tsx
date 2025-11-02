"use client";

import { GarbageItemWithCategory } from "@/types/garbage";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<GarbageItemWithCategory>[] = [
  {
    accessorKey: "name",
    header: "品目名",
  },
  {
    accessorKey: "garbageCategory",
    header: "分別区分",
  },
  {
    accessorKey: "note",
    header: "備考",
  },
];

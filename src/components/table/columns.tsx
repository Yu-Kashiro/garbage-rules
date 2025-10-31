"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Info } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Garbage = {
  name: string;
  category: string;
};

export const columns: ColumnDef<Garbage>[] = [
  {
    accessorKey: "name",
    header: "品目名",
    cell: ({ row }) => {
      return (
        <div className="max-w-[200px] truncate">{row.getValue("name")}</div>
      );
    },
  },
  {
    id: "actions",
    header: "",
    size: 50,
    cell: ({ row }) => {
      const garbage = row.original;

      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Info className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{garbage.name}</DialogTitle>
              <DialogDescription>
                分別区分：{garbage.category}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );
    },
  },
];

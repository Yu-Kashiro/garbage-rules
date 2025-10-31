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
import { useIsMobile } from "@/hooks/use-mobile";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Garbage = {
  name: string;
  category: string;
};

export const useColumns = (): ColumnDef<Garbage>[] => {
  const isMobile = useIsMobile();

  const baseColumns: ColumnDef<Garbage>[] = [
    {
      accessorKey: "name",
      header: "品目名",
      cell: ({ row }) => {
        return (
          <div className="max-w-[200px] truncate">{row.getValue("name")}</div>
        );
      },
    },
  ];

  if (isMobile) {
    // モバイル表示の場合はDialogボタンを表示
    return [
      ...baseColumns,
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
                    分別区分:{garbage.category}
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          );
        },
      },
    ];
  }

  // デスクトップ表示の場合は分別区分列を直接表示
  return [
    ...baseColumns,
    {
      accessorKey: "category",
      header: "分別区分",
      cell: ({ row }) => {
        return <div>{row.getValue("category")}</div>;
      },
    },
  ];
};

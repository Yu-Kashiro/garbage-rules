"use client";

import { useColumns, Garbage } from "./columns";
import { DataTable } from "./data-table";
import bunbetsuData from "./bunbetsu_data.json";

export default function SearchGarbage() {
  const columns = useColumns();
  const data = bunbetsuData as Garbage[];

  return (
    <div className="py-5">
      <DataTable columns={columns} data={data} />
    </div>
  );
}

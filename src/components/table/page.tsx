import { columns, Garbage } from "./columns";
import { DataTable } from "./data-table";
import bunbetsuData from "./bunbetsu_data.json";

async function getData(): Promise<Garbage[]> {
  return bunbetsuData as Garbage[];
}

export default async function SearchGarbage() {
  const data = await getData();

  return (
    <div className="py-5">
      <DataTable columns={columns} data={data} />
    </div>
  );
}

import { GarbageSearchForm } from "@/components/garbage-search-form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { getGarbageItems, searchGarbageItem } from "@/data/garbage";
import { createLoader, parseAsString } from "nuqs/server";

export const loadSearchParams = createLoader({
  name: parseAsString.withDefault(""),
});

export default async function Home({searchParams}: PageProps<"/">) {
  const { name } = await loadSearchParams(searchParams);
  const garbageList = name ? await searchGarbageItem(name) : await getGarbageItems();

  return (
    <main className="flex flex-1 items-start justify-center bg-background-main pt-10 md:pt-10">
      <div className="container max-w-3xl px-4 space-y-10">
        <h1 className="text-center text-xl font-bold md:text-4xl">
          捨てたいごみを入力してください。
        </h1>

        <GarbageSearchForm />
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>品目名</TableHead>
                <TableHead>分別区分</TableHead>
                <TableHead>備考</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {garbageList.map((garbage) => (
                <TableRow key={garbage.id}>
                  <TableCell>{garbage.name}</TableCell>
                  <TableCell>{garbage.garbageCategory}</TableCell>
                  <TableCell>{garbage.note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  );
}

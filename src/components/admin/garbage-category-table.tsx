import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GarbageCategoryEditDialog } from "./garbage-category-edit-dialog";
import { getGarbageCategories } from "@/data/garbage";

export async function GarbageCategoryTable() {
  const categories = await getGarbageCategories();

  if (categories.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        登録されている分別区分がありません
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-28">番号</TableHead>
            <TableHead>分別区分名</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category, index) => (
            <TableRow key={category.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell
                className="truncate max-w-[300px]"
                title={category.name}
              >
                {category.name}
              </TableCell>
              <TableCell className="text-right whitespace-nowrap">
                <GarbageCategoryEditDialog category={category} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

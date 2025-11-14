import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  return (
    <div className="h-content container max-w-3xl mx-auto px-4 py-10 space-y-15">
      <div className="space-y-5 max-w-2xl mx-auto">
        <h1 className="text-center text-xl font-bold md:text-3xl">分別区分</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <Button variant="outline" className="flex-1 h-24 text-xl" asChild>
            <Link href="/admin/data/category/new">新規登録</Link>
          </Button>
          <Button variant="outline" className="flex-1 h-24 text-xl" asChild>
            <Link href="/admin/data/category">編集・削除</Link>
          </Button>
        </div>
      </div>

      <div className="space-y-5 max-w-2xl mx-auto">
        <h1 className="text-center text-xl font-bold md:text-3xl">ごみ品目</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <Button variant="outline" className="flex-1 h-24 text-xl" asChild>
            <Link href="/admin/data/item/new">新規登録</Link>
          </Button>
          <Button variant="outline" className="flex-1 h-24 text-xl" asChild>
            <Link href="/admin/data/item">編集・削除</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

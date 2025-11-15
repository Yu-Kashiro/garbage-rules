import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  return (
    <div className="h-content container mx-auto px-4 py-10">
      <h1 className="text-center text-xl font-bold md:text-3xl mb-10">
        管理者メニュー
      </h1>

      <div className="space-y-5 max-w-2xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4">
          <Button variant="outline" className="flex-1 h-24 text-xl" asChild>
            <Link href="/admin/data/categories">分別区分を管理</Link>
          </Button>
          <Button variant="outline" className="flex-1 h-24 text-xl" asChild>
            <Link href="/admin/data/items">ごみ品目を管理</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

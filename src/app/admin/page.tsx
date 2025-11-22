import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  return (
    <div className="h-content container mx-auto px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="relative flex items-center">
            <div className="flex justify-start">
              <Button variant="outline" asChild>
                <Link href="/">
                  ←<span className="hidden md:inline"> 戻る</span>
                </Link>
              </Button>
            </div>
            <h1 className="absolute left-1/2 -translate-x-1/2 text-xl font-bold md:text-3xl whitespace-nowrap">
              管理者メニュー
            </h1>
          </div>
        </div>

        <div className="space-y-5">
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
    </div>
  );
}

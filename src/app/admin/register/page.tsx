import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  return (
    <div className="h-content">
      <div className="container max-w-3xl mx-auto py-10">
        <div className="mb-8">
          <h1 className="text-center text-xl font-bold md:text-3xl">
            ごみ情報登録・編集
          </h1>
        </div>

        <div className="max-w-2xl mx-auto space-y-10">
          <Button variant="outline" className="w-full h-24 text-xl" asChild>
            <Link href="/admin/register/category">分別区分</Link>
          </Button>

          <Button variant="outline" className="w-full h-24 text-xl" asChild>
            <Link href="/admin/register/item">ごみ品目</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

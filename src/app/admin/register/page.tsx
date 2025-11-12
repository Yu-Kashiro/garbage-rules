import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <div className="container max-w-3xl mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl text-center font-bold mb-2">
          ごみ情報登録・編集
        </h1>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <Link href="/admin/register/category" className="block">
          <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle>「分別区分」の登録・編集</CardTitle>
              <CardDescription>
                新しいごみの分別区分を登録します
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                例: 燃えるごみ、燃えないごみ、資源ごみなど
              </p>
              <Button variant="outline" className="w-full">
                登録ページへ
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/register/item" className="block">
          <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle>「ごみ品目」の登録・編集</CardTitle>
              <CardDescription>新しいごみの品目を登録します</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                例: ペットボトル、新聞紙、プラスチック容器など
              </p>
              <Button variant="outline" className="w-full">
                登録ページへ
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}

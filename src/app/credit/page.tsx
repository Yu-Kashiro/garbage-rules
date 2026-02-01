import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

export default function CreditPage() {
  return (
    <main className="flex flex-1 bg-gradient-to-b from-background via-background-main to-accent/30 pt-4 md:pt-10">
      <div className="container max-w-3xl space-y-6">
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <h1 className="text-2xl font-bold md:text-3xl text-foreground mb-6">
            クレジット
          </h1>

          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
              イラスト素材
            </h2>
            <div className="space-y-2">
              <p className="text-muted-foreground">
                このサイトで使用しているイラストは、以下のフリー素材サイトから提供されています。
              </p>
              <div className="flex items-center gap-2">
                <a
                  href="https://soco-st.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
                >
                  ソコスト
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
              <p className="text-sm text-muted-foreground">
                シンプルでおしゃれなイラスト素材を無料で提供するフリーイラストサイトです。
              </p>
            </div>
          </div>

          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              ホームへ戻る
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

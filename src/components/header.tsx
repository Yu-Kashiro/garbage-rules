"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";
import { CITY_TITLE } from "@/lib/city";
import { Loader2, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-14 items-center mx-auto justify-between">
        {/* ロゴ・タイトル */}
        <Button variant="ghost" asChild>
          <Link href="/" className="flex gap-2 items-center">
            <Image
              src="/images/earth-leaf.svg"
              alt="地球と葉"
              width={28}
              height={28}
              className="h-7 w-7"
            />
            <p className="text-sm md:text-base">{CITY_TITLE}</p>
          </Link>
        </Button>

        {/* ========== デスクトップナビゲーション ========== */}
        <div className="hidden md:flex gap-2">
          {/* ローディング中 */}
          {isPending && (
            <>
              <Button variant="outline" disabled className="w-[120px]">
                <Loader2 className="h-4 w-4 animate-spin" />
              </Button>
              <Button variant="outline" disabled className="w-[120px]">
                <Loader2 className="h-4 w-4 animate-spin" />
              </Button>
            </>
          )}

          {/* ログイン済み */}
          {!isPending && session && (
            <>
              <Button variant="outline" asChild className="w-[120px]">
                <Link href="/admin">管理者メニュー</Link>
              </Button>
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="w-[120px]"
              >
                ログアウト
              </Button>
            </>
          )}

          {/* 未ログイン */}
          {!isPending && !session && (
            <>
              <Button variant="outline" asChild className="w-[120px]">
                <Link href="/login">ログイン</Link>
              </Button>
              <Button variant="outline" asChild className="w-[120px]">
                <Link href="/signup">新規登録</Link>
              </Button>
            </>
          )}
        </div>

        {/* ========== モバイルナビゲーション ========== */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">メニュー</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <SheetHeader>
                <SheetTitle>メニュー</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-6 px-4">
                {/* ローディング中 */}
                {isPending && (
                  <>
                    <Button variant="outline" disabled className="w-full">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </Button>
                    <Button variant="outline" disabled className="w-full">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </Button>
                  </>
                )}

                {/* ログイン済み */}
                {!isPending && session && (
                  <>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/admin" onClick={closeMenu}>
                        管理者画面
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        closeMenu();
                        handleSignOut();
                      }}
                    >
                      ログアウト
                    </Button>
                  </>
                )}

                {/* 未ログイン */}
                {!isPending && !session && (
                  <>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/login" onClick={closeMenu}>
                        ログイン
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/signup" onClick={closeMenu}>
                        新規登録
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

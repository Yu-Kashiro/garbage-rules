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
import { Loader2, Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const Header = () => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

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
          <Link href="/" className="flex gap-4 items-center">
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
            <p className="text-sm md:text-base">{CITY_TITLE}</p>
          </Link>
        </Button>

        {/* ========== デスクトップナビゲーション ========== */}
        <div className="hidden md:flex gap-2">
          {/* テーマ切り替えボタン */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">テーマ切り替え</span>
          </Button>

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

                {/* テーマ切り替えボタン */}
                <Button
                  variant="secondary"
                  className="w-full justify-center"
                  onClick={toggleTheme}
                >
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

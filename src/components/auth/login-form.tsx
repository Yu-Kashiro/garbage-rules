"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { LoginFormData } from "@/types/auth";
import { loginFormSchema } from "@/zod/login-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

export function LoginForm() {
  const router = useRouter();
  const [isGuestLoading, setIsGuestLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // ログイン処理
  async function onSubmit(data: LoginFormData) {
    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess() {
          router.push("/admin");
        },
        onError(ctx) {
          toast.error(
            ctx.error.status === 401
              ? "メールアドレスまたはパスワードが間違っています。"
              : ctx.error.message
          );
        },
      }
    );
  }

  // ゲストログイン処理
  async function handleGuestLogin() {
    setIsGuestLoading(true);
    try {
      await authClient.signIn.anonymous();
      router.push("/admin");
    } catch {
      toast.error("ゲストログインに失敗しました");
    } finally {
      setIsGuestLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>ログイン</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* メールアドレス */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>メールアドレス</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="email" type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* パスワード */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>パスワード</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      autoComplete="current-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex-col md:flex-row gap-4">
            {/* ログインボタン */}
            <Button
              disabled={form.formState.isSubmitting}
              type="submit"
              className="w-full md:w-[120px]"
            >
              {form.formState.isSubmitting ? (
                <Spinner className="size-4" />
              ) : (
                "ログイン"
              )}
            </Button>

            {/* ゲストログインボタン */}
            <Button
              className="w-full md:w-[140px] md:ml-auto"
              variant="outline"
              type="button"
              disabled={isGuestLoading}
              onClick={handleGuestLogin}
            >
              {isGuestLoading ? (
                <Spinner className="size-4" />
              ) : (
                "ゲストログイン"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

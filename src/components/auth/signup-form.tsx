"use client";

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
  CardDescription,
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

export function SignupForm() {
  const router = useRouter();
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 新規登録処理
  async function onSubmit(data: LoginFormData) {
    await authClient.signUp.email(
      {
        email: data.email,
        password: data.password,
        name: data.email,
      },
      {
        onSuccess() {
          router.push("/admin");
        },
        onError(ctx) {
          toast.error(ctx.error.message);
        },
      }
    );
  }

  // テスト用のランダムデータをセット
  function handleSetRandomData() {
    form.setValue("email", `test${Math.random()}@example.com`);
    form.setValue("password", "Password123!");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>新規登録</CardTitle>
            <CardDescription>
              アカウントを作成するには、メールアドレスとパスワードを入力してください。
            </CardDescription>
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
                      autoComplete="new-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex-col md:flex-row gap-4">
            {/* 新規登録ボタン */}
            <Button
              disabled={form.formState.isSubmitting}
              type="submit"
              className="w-full md:w-[120px]"
            >
              {form.formState.isSubmitting ? (
                <Spinner className="size-4" />
              ) : (
                "新規登録"
              )}
            </Button>

            {/* ランダムデータセットボタン */}
            <Button
              variant="outline"
              className="w-full md:w-auto md:ml-auto"
              type="button"
              onClick={handleSetRandomData}
            >
              ランダムデータをセット
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

"use client";

import { authClient } from "@/lib/auth-client";
import { LoginFormData } from "@/types/auth";
import { loginFormSchema } from "@/zod/login-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Spinner } from "./ui/spinner";

export function LoginForm({ signUp = false }: { signUp?: boolean }) {
  const router = useRouter();
  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormData) {
    if (signUp) {
      await authClient.signUp.email(
        {
          email: data.email,
          password: data.password,
          name: data.email,
          callbackURL: "/admin",
        },
        {
          onError(ctx) {
            toast.error(ctx.error.message);
          },
        }
      );
    }

    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
        callbackURL: "/admin",
      },
      {
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>{signUp ? "新規登録" : "ログイン"}</CardTitle>
            <CardDescription>
              {signUp
                ? "アカウントを作成するには、メールアドレスとパスワードを入力してください。"
                : ""}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
                      autoComplete={
                        signUp ? "new-password" : "current-password"
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex-col md:flex-row gap-4">
            <Button
              disabled={form.formState.isSubmitting}
              type="submit"
              className="w-full md:w-[120px]"
            >
              {form.formState.isSubmitting ? (
                <Spinner className="size-4" />
              ) : signUp ? (
                "新規登録"
              ) : (
                "ログイン"
              )}
            </Button>

            {signUp ? (
              <Button
                variant="outline"
                className="w-full md:w-auto md:ml-auto"
                type="button"
                onClick={() => {
                  form.setValue("email", `test${Math.random()}@example.com`);
                  form.setValue("password", "Password123!");
                }}
              >
                ランダムデータをセット
              </Button>
            ) : (
              <Button
                className="w-full md:w-[140px] md:ml-auto"
                variant="outline"
                type="button"
                disabled={isGuestLoading}
                onClick={async () => {
                  setIsGuestLoading(true);
                  try {
                    await authClient.signIn.anonymous();
                    router.push("/admin");
                  } catch {
                    toast.error("ゲストログインに失敗しました");
                  } finally {
                    setIsGuestLoading(false);
                  }
                }}
              >
                {isGuestLoading ? (
                  <Spinner className="size-4" />
                ) : (
                  "ゲストログイン"
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

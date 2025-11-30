"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { garbageItemFormSchema } from "@/zod/garbage";
import type { GarbageCategory, GarbageItemFormSchema } from "@/types/garbage";
import { createGarbageItem } from "@/actions/garbage";

export function CreateItemButton({
  categories,
}: {
  categories: GarbageCategory[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<GarbageItemFormSchema>({
    resolver: zodResolver(garbageItemFormSchema),
    defaultValues: {
      name: "",
      garbageCategory: 2,
      note: "",
      search: "",
    },
  });

  const handleClose = () => {
    setIsOpen(false);
    form.reset();
  };

  const handleCreate = async (data: GarbageItemFormSchema) => {
    try {
      await createGarbageItem(data);
      toast.success(`「${data.name}」を登録しました`);
      handleClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "登録に失敗しました"
      );
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <span className="md:hidden">+</span>
        <span className="hidden md:inline">新規登録</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ごみ品目の新規登録</DialogTitle>
            <DialogDescription>
              ごみ品目の情報を入力してください
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleCreate)}>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="create-garbage-item-name">
                      品目名
                    </FieldLabel>
                    <Input
                      {...field}
                      id="create-garbage-item-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="例: ペットボトル、新聞紙"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="garbageCategory"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    orientation="responsive"
                    data-invalid={fieldState.invalid}
                  >
                    <FieldContent>
                      <FieldLabel htmlFor="create-garbage-item-category">
                        分別区分
                      </FieldLabel>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </FieldContent>
                    <Select
                      name={field.name}
                      value={field.value.toString()}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <SelectTrigger
                        id="create-garbage-item-category"
                        aria-invalid={fieldState.invalid}
                        className="min-w-[200px]"
                      >
                        <SelectValue placeholder="選択してください" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />

              <Controller
                name="note"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="create-garbage-item-note">
                      備考（任意）
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id="create-garbage-item-note"
                      aria-invalid={fieldState.invalid}
                      placeholder="捨て方の注意点などを入力してください"
                      className="min-h-[100px]"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="search"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="create-garbage-item-search">
                      検索キーワード（任意）
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id="create-garbage-item-search"
                      aria-invalid={fieldState.invalid}
                      placeholder="振り仮名等の他の読み方があれば記載してください"
                      className="min-h-[100px]"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={handleClose}>
                キャンセル
              </Button>
              <Button type="submit">登録</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

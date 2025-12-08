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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { garbageItemFormSchema } from "@/zod/garbage";
import type {
  GarbageCategory,
  GarbageItem,
  GarbageItemFormData,
} from "@/types/garbage";
import {
  createGarbageItem,
  deleteGarbageItem,
  updateGarbageItem,
} from "@/actions/garbage";

interface GarbageItemFormDialogProps {
  item?: GarbageItem;
  categories: GarbageCategory[];
}

export function GarbageItemEditDialog({
  item,
  categories,
}: GarbageItemFormDialogProps) {
  const isEditMode = !!item;
  const [open, setOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // 新規作成時のデフォルトカテゴリ（カテゴリリストの最初のID、または未定義）
  const defaultCategoryId = categories[0]?.id;

  const form = useForm<GarbageItemFormData>({
    resolver: zodResolver(garbageItemFormSchema),
    defaultValues: {
      name: item?.name ?? "",
      garbageCategory: item?.garbageCategory ?? defaultCategoryId,
      note: item?.note ?? "",
      search: item?.search ?? "",
    },
  });

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      form.reset({
        name: item?.name ?? "",
        garbageCategory: item?.garbageCategory ?? defaultCategoryId,
        note: item?.note ?? "",
        search: item?.search ?? "",
      });
    } else {
      setShowDeleteConfirm(false);
    }
  };

  const handleSubmit = async (data: GarbageItemFormData) => {
    try {
      if (isEditMode) {
        await updateGarbageItem(item.id, data);
        toast.success(`「${item.name}」を更新しました`);
      } else {
        await createGarbageItem(data);
        toast.success(`「${data.name}」を登録しました`);
      }
      setOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : isEditMode
          ? "更新に失敗しました"
          : "登録に失敗しました"
      );
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!isEditMode) return;

    try {
      await deleteGarbageItem(item.id);
      toast.success(`「${item.name}」を削除しました`);
      setOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "削除に失敗しました"
      );
      setShowDeleteConfirm(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          {isEditMode ? (
            <Button variant="outline" size="sm">
              編集
            </Button>
          ) : (
            <Button>
              <span className="md:hidden">+</span>
              <span className="hidden md:inline">新規登録</span>
            </Button>
          )}
        </DialogTrigger>

        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>
              ごみ品目の{isEditMode ? "編集" : "新規登録"}
            </DialogTitle>
            <DialogDescription>
              ごみ品目の情報を{isEditMode ? "編集" : "入力"}してください
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor={
                        isEditMode
                          ? `edit-garbage-item-name-${item.id}`
                          : "create-garbage-item-name"
                      }
                    >
                      品目名
                    </FieldLabel>
                    <Input
                      {...field}
                      id={
                        isEditMode
                          ? `edit-garbage-item-name-${item.id}`
                          : "create-garbage-item-name"
                      }
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
                      <FieldLabel
                        htmlFor={
                          isEditMode
                            ? `edit-garbage-item-category-${item.id}`
                            : "create-garbage-item-category"
                        }
                      >
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
                        id={
                          isEditMode
                            ? `edit-garbage-item-category-${item.id}`
                            : "create-garbage-item-category"
                        }
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
                    <FieldLabel
                      htmlFor={
                        isEditMode
                          ? `edit-garbage-item-note-${item.id}`
                          : "create-garbage-item-note"
                      }
                    >
                      備考（任意）
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id={
                        isEditMode
                          ? `edit-garbage-item-note-${item.id}`
                          : "create-garbage-item-note"
                      }
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
                    <FieldLabel
                      htmlFor={
                        isEditMode
                          ? `edit-garbage-item-search-${item.id}`
                          : "create-garbage-item-search"
                      }
                    >
                      検索キーワード（任意）
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id={
                        isEditMode
                          ? `edit-garbage-item-search-${item.id}`
                          : "create-garbage-item-search"
                      }
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
            <DialogFooter className="mt-6 flex-row gap-2 justify-end">
              {isEditMode && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDeleteClick}
                >
                  削除
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                キャンセル
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {isEditMode ? "更新" : "登録"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 削除確認ダイアログ */}
      {isEditMode && (
        <AlertDialog
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>本当に削除しますか?</AlertDialogTitle>
              <AlertDialogDescription>
                この操作は取り消せません。「{item.name}
                」を完全に削除します。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>キャンセル</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>
                削除する
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}

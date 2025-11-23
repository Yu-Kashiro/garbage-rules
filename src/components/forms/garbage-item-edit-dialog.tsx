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
  GarbageItemFormSchema,
} from "@/types/garbage";
import {
  deleteGarbageItem,
  updateGarbageItem,
} from "@/actions/garbage";

interface GarbageItemEditDialogProps {
  item: GarbageItem;
  categories: GarbageCategory[];
}

export function GarbageItemEditDialog({
  item,
  categories,
}: GarbageItemEditDialogProps) {
  const [open, setOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const editForm = useForm<GarbageItemFormSchema>({
    resolver: zodResolver(garbageItemFormSchema),
    defaultValues: {
      name: item.name,
      garbageCategory: item.garbageCategory,
      note: item.note || "",
    },
  });

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      editForm.reset({
        name: item.name,
        garbageCategory: item.garbageCategory,
        note: item.note || "",
      });
    } else {
      setShowDeleteConfirm(false);
      editForm.reset();
    }
  };

  const handleUpdate = async (data: GarbageItemFormSchema) => {
    try {
      await updateGarbageItem(item.id, data);
      toast.success(`「${item.name}」を更新しました`);
      setOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "更新に失敗しました"
      );
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
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
          <Button variant="outline" size="sm">
            編集
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ごみ品目の編集</DialogTitle>
            <DialogDescription>
              ごみ品目の情報を編集してください
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(handleUpdate)}>
            <FieldGroup>
              <Controller
                name="name"
                control={editForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`edit-garbage-item-name-${item.id}`}>
                      品目名
                    </FieldLabel>
                    <Input
                      {...field}
                      id={`edit-garbage-item-name-${item.id}`}
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
                control={editForm.control}
                render={({ field, fieldState }) => (
                  <Field
                    orientation="responsive"
                    data-invalid={fieldState.invalid}
                  >
                    <FieldContent>
                      <FieldLabel htmlFor={`edit-garbage-item-category-${item.id}`}>
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
                        id={`edit-garbage-item-category-${item.id}`}
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
                control={editForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`edit-garbage-item-note-${item.id}`}>
                      備考（任意）
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id={`edit-garbage-item-note-${item.id}`}
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
            </FieldGroup>
            <DialogFooter className="mt-6 flex justify-between">
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteClick}
              >
                削除
              </Button>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  キャンセル
                </Button>
                <Button
                  type="submit"
                  disabled={editForm.formState.isSubmitting}
                >
                  更新
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 削除確認ダイアログ */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
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
    </>
  );
}

"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ColorPicker } from "@/components/color-picker";
import { garbageCategoryFormSchema } from "@/zod/garbage";
import type { GarbageCategory, GarbageCategoryFormData } from "@/types/garbage";
import {
  createGarbageCategory,
  deleteGarbageCategory,
  updateGarbageCategory,
} from "@/actions/garbage";

interface GarbageCategoryFormDialogProps {
  category?: GarbageCategory;
}

export function GarbageCategoryEditDialog({
  category,
}: GarbageCategoryFormDialogProps) {
  const isEditMode = !!category;
  const [open, setOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const form = useForm<GarbageCategoryFormData>({
    resolver: zodResolver(garbageCategoryFormSchema),
    defaultValues: {
      name: category?.name ?? "",
      color: category?.color ?? "#808080",
    },
  });

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      form.reset({
        name: category?.name ?? "",
        color: category?.color ?? "#808080",
      });
    } else {
      setShowDeleteConfirm(false);
      form.reset();
    }
  };

  const handleSubmit = async (data: GarbageCategoryFormData) => {
    try {
      if (isEditMode) {
        await updateGarbageCategory(category.id, data);
        toast.success(`「${category.name}」を更新しました`);
      } else {
        await createGarbageCategory(data);
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
      await deleteGarbageCategory(category.id);
      toast.success(`「${category.name}」を削除しました`);
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
        {isEditMode ? (
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              編集
            </Button>
          </DialogTrigger>
        ) : (
          <Button onClick={() => setOpen(true)}>
            <span className="md:hidden">+</span>
            <span className="hidden md:inline">新規登録</span>
          </Button>
        )}

        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>
              分別区分の{isEditMode ? "編集" : "新規登録"}
            </DialogTitle>
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
                          ? `edit-garbage-category-name-${category.id}`
                          : "create-garbage-category-name"
                      }
                    >
                      分別区分名
                    </FieldLabel>
                    <Input
                      {...field}
                      id={
                        isEditMode
                          ? `edit-garbage-category-name-${category.id}`
                          : "create-garbage-category-name"
                      }
                      aria-invalid={fieldState.invalid}
                      placeholder="例: 燃えるごみ、燃えないごみ"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="color"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <ColorPicker
                      label="色"
                      value={field.value}
                      onChange={field.onChange}
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
                削除すると、「{category.name}
                」の「ごみ品目」も全て削除されます。
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

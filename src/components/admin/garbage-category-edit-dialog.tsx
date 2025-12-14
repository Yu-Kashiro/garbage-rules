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
    const result = isEditMode
      ? await updateGarbageCategory(category.id, data)
      : await createGarbageCategory(data);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(
      isEditMode
        ? `「${category.name}」を更新しました`
        : `「${data.name}」を登録しました`
    );
    setOpen(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!isEditMode) return;

    const result = await deleteGarbageCategory(category.id);

    if (!result.success) {
      toast.error(result.error);
      setShowDeleteConfirm(false);
      return;
    }

    toast.success(`「${category.name}」を削除しました`);
    setOpen(false);
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
          <Button onClick={() => handleOpenChange(true)}>
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
              <AlertDialogAction onClick={handleDelete}>
                削除する
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}

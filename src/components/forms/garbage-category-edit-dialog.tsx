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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { garbageCategoryFormSchema } from "@/zod/garbage";
import type { GarbageCategory, GarbageCategoryFormData } from "@/types/garbage";
import {
  deleteGarbageCategory,
  updateGarbageCategory,
} from "@/actions/garbage";

interface GarbageCategoryEditDialogProps {
  category: GarbageCategory;
}

export function GarbageCategoryEditDialog({
  category,
}: GarbageCategoryEditDialogProps) {
  const [open, setOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const editForm = useForm<GarbageCategoryFormData>({
    resolver: zodResolver(garbageCategoryFormSchema),
    defaultValues: {
      name: category.name,
    },
  });

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      editForm.reset({ name: category.name });
    } else {
      setShowDeleteConfirm(false);
      editForm.reset();
    }
  };

  const handleUpdate = async (data: GarbageCategoryFormData) => {
    try {
      await updateGarbageCategory(category.id, data);
      toast.success(
        `「${category.name}」を「${data.name}」に更新しました`
      );
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
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            編集
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>分別区分の編集</DialogTitle>
            <DialogDescription>分別区分名を編集してください</DialogDescription>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(handleUpdate)}>
            <FieldGroup>
              <Controller
                name="name"
                control={editForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`edit-garbage-category-name-${category.id}`}>
                      分別区分名
                    </FieldLabel>
                    <Input
                      {...field}
                      id={`edit-garbage-category-name-${category.id}`}
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
            </FieldGroup>
            <DialogFooter className="mt-6 flex-row gap-2 justify-end">
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteClick}
              >
                削除
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                キャンセル
              </Button>
              <Button type="submit" disabled={editForm.formState.isSubmitting}>
                更新
              </Button>
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
    </>
  );
}

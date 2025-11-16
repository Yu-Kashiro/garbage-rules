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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

export function GarbageCategoryTable({
  categories,
}: {
  categories: GarbageCategory[];
}) {
  const [editingCategory, setEditingCategory] =
    useState<GarbageCategory | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const editForm = useForm<GarbageCategoryFormData>({
    resolver: zodResolver(garbageCategoryFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleEditClick = (category: GarbageCategory) => {
    setEditingCategory(category);
    editForm.reset({ name: category.name });
  };

  const handleEditClose = () => {
    setEditingCategory(null);
    setShowDeleteConfirm(false);
    editForm.reset();
  };

  const handleUpdate = async (data: GarbageCategoryFormData) => {
    if (!editingCategory) return;

    try {
      await updateGarbageCategory(editingCategory.id, data);
      toast.success(
        `「${editingCategory.name}」を「${data.name}」に更新しました`
      );
      handleEditClose();
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
    if (!editingCategory) return;

    try {
      await deleteGarbageCategory(editingCategory.id);
      toast.success(`「${editingCategory.name}」を削除しました`);
      handleEditClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "削除に失敗しました"
      );
      setShowDeleteConfirm(false);
    }
  };

  if (categories.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        登録されている分別区分がありません
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-28">ID</TableHead>
              <TableHead>分別区分名</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.id}</TableCell>
                <TableCell
                  className="truncate max-w-[300px]"
                  title={category.name}
                >
                  {category.name}
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditClick(category)}
                  >
                    編集
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 編集ダイアログ */}
      <Dialog open={!!editingCategory} onOpenChange={handleEditClose}>
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
                    <FieldLabel htmlFor="edit-garbage-category-name">
                      分別区分名
                    </FieldLabel>
                    <Input
                      {...field}
                      id="edit-garbage-category-name"
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
              <Button type="button" variant="outline" onClick={handleEditClose}>
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
              削除すると、「{editingCategory?.name}
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

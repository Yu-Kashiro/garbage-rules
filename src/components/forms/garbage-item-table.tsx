"use client";

import { deleteGarbageItem, updateGarbageItem } from "@/actions/garbage";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import type {
  GarbageCategory,
  GarbageItem,
  GarbageItemFormSchema,
} from "@/types/garbage";
import { garbageItemFormSchema } from "@/zod/garbage";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export function GarbageItemTable({
  items,
  categories,
}: {
  items: GarbageItem[];
  categories: GarbageCategory[];
}) {
  const [editingItem, setEditingItem] = useState<GarbageItem | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const editForm = useForm<GarbageItemFormSchema>({
    resolver: zodResolver(garbageItemFormSchema),
    defaultValues: {
      name: "",
      garbageCategory: 0,
      note: "",
    },
  });

  const handleEditClick = (item: GarbageItem) => {
    setEditingItem(item);
    editForm.reset({
      name: item.name,
      garbageCategory: item.garbageCategory,
      note: item.note || "",
    });
  };

  const handleEditClose = () => {
    setEditingItem(null);
    setShowDeleteConfirm(false);
    editForm.reset();
  };

  const handleUpdate = async (data: GarbageItemFormSchema) => {
    if (!editingItem) return;

    try {
      await updateGarbageItem(editingItem.id, data);
      toast.success(`「${editingItem.name}」を更新しました`);
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
    if (!editingItem) return;

    try {
      await deleteGarbageItem(editingItem.id);
      toast.success(`「${editingItem.name}」を削除しました`);
      handleEditClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "削除に失敗しました"
      );
      setShowDeleteConfirm(false);
    }
  };

  // カテゴリIDから名前を取得
  const getCategoryName = (categoryId: number) => {
    return categories.find((c) => c.id === categoryId)?.name || "不明";
  };

  if (items.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        登録されているごみ品目がありません
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>品目名</TableHead>
              <TableHead>分別区分</TableHead>
              <TableHead className="hidden md:table-cell">備考</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell className="truncate max-w-[200px]" title={item.name}>
                  {item.name}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {getCategoryName(item.garbageCategory)}
                </TableCell>
                <TableCell
                  className="hidden md:table-cell truncate max-w-[200px]"
                  title={item.note || ""}
                >
                  {item.note || "-"}
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditClick(item)}
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
      <Dialog open={!!editingItem} onOpenChange={handleEditClose}>
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
                    <FieldLabel htmlFor="edit-garbage-item-name">
                      品目名
                    </FieldLabel>
                    <Input
                      {...field}
                      id="edit-garbage-item-name"
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
                      <FieldLabel htmlFor="edit-garbage-item-category">
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
                        id="edit-garbage-item-category"
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
                    <FieldLabel htmlFor="edit-garbage-item-note">
                      備考（任意）
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id="edit-garbage-item-note"
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
                  onClick={handleEditClose}
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
              この操作は取り消せません。「{editingItem?.name}
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

"use client";

import { createGarbageCategory } from "@/actions/garbage";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { GarbageCategoryFormData } from "@/types/garbage";
import { garbageCategoryFormSchema } from "@/zod/garbage";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export function CreateCategoryButton() {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<GarbageCategoryFormData>({
    resolver: zodResolver(garbageCategoryFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleClose = () => {
    setIsOpen(false);
    form.reset();
  };

  const handleCreateGarbageCategory = async (data: GarbageCategoryFormData) => {
    try {
      await createGarbageCategory(data);
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
            <DialogTitle>分別区分の新規登録</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleCreateGarbageCategory)}>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="create-garbage-category-name">
                      分別区分名
                    </FieldLabel>
                    <Input
                      {...field}
                      id="create-garbage-category-name"
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
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={handleClose}>
                キャンセル
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                登録
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

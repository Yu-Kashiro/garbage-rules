import z from "zod";

export const passwordSchema = z
  .string()
  .min(8, { message: "8文字以上で入力してください。" })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]+$/, {
    message: "大文字、小文字、数字、記号を含む半角英数字を入力してください。",
  });

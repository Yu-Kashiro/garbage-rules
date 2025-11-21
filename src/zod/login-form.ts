import z from "zod";
import { passwordSchema } from "./password";

export const loginFormSchema = z.object({
  email: z.email({ message: "メールアドレスが不正です。" }),
  password: passwordSchema,
});

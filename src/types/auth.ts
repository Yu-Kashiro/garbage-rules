import { loginFormSchema } from "@/zod/login-form";
import z from "zod/v4";

export type LoginFormData = z.infer<typeof loginFormSchema>;

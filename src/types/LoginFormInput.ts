import * as z from "zod";

// ログインフォームの入力値のルールを定義
export const loginInputSchema = z.object({
  email: z
    .string()
    .email({ message: "正しいメールアドレスを入力してください" }),
  password: z.string().min(1, { message: "パスワードを入力してください" }),
});

// ZodのスキーマからTypeScriptの型を生成
export type LoginFormInput = z.infer<typeof loginInputSchema>;

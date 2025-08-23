import * as z from "zod";

// 1. Zodを使って、サインアップフォームの入力ルールを定義
export const signUpInputSchema = z.object({
  // emailは、文字列で、メールアドレスの形式であること
  email: z
    .string()
    .email({ message: "正しいメールアドレスを入力してください" }),
  // passwordは、文字列で、最低6文字以上であること
  password: z
    .string()
    .min(6, { message: "パスワードは6文字以上で入力してください" }),
});

// 2. Zodのスキーマから、TypeScriptの型を自動で生成
export type SignUpFormInput = z.infer<typeof signUpInputSchema>;

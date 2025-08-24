import { zodResolver } from "@hookform/resolvers/zod";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import AccountFormFooter from "../components/ui-elements/AccountFormFooter";
import AccountTextField from "../components/ui-elements/AccountTextField";
import { supabase } from "../utils/supabase";
import { signUpInputSchema } from "../types/SignUpFormInput";

import type { SignUpFormInput } from "../types/SignUpFormInput";
import type { SubmitHandler } from "react-hook-form";

export default function SignUp() {
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<SignUpFormInput>({
    resolver: zodResolver(signUpInputSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<SignUpFormInput> = async (data) => {
    try {
      const { email, password } = data;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/register-profile`,
        },
      });

      if (error) {
        throw new Error(error.message);
      }
      navigate("/register-profile");
    } catch (err) {
      console.log(err);
    } finally {
      reset();
    }
  };

  const handleClick = () => {
    navigate("/login", { state: { referrer: "signUp" } });
  };
  const handleSignInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/register-profile`,
      },
    });

    if (error) {
      console.error("Google認証エラー:", error.message);
    }
  };

  return (
    <div className="w-full flex justify-center items-center p-4">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-2">
          アカウントを作成
        </h2>
        <h4 className="text-center text-sm text-gray-600 mb-10">
          メールアドレスとパスワードを入力してください
        </h4>
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "32px",
            width: "100%",
          }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <AccountTextField
            id="email"
            name="email"
            control={control}
            error={errors.email?.message}
            type="text"
            label="メールアドレス"
            secondaryLabel="メールアドレスを入力..."
            icon={<PersonOutlineOutlinedIcon />}
            disabled={isSubmitting}
          />
          <AccountTextField
            id="password"
            name="password"
            control={control}
            type="password"
            error={errors.password?.message}
            label="パスワード"
            secondaryLabel="パスワードを入力..."
            icon={<LockOutlinedIcon />}
            disabled={isSubmitting}
          />
          <AccountFormFooter
            disabled={isSubmitting}
            text="登録"
            icon={<ArrowForwardIcon />}
            secondaryText="アカウントをお持ちの方はこちら"
            onClick={handleClick}
          />
          <div className="mt-6 flex items-center justify-center px-15">
            <div className="w-full border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500 whitespace-nowrap">
              または次の方法で続行
            </span>
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="justify-center items-center flex">
            <button
              onClick={handleSignInWithGoogle}
              disabled={isSubmitting}
              className="w-4/5 py-3 flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <img
                src="/logos/google.png"
                alt="Google logo"
                className="h-5 w-5"
              />
              <span>Google</span>
            </button>
          </div>
        </Box>
      </div>
    </div>
  );
}

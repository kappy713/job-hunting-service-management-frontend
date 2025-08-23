import { TextField, InputAdornment } from "@mui/material";
// ↓ Pathを追加でimport
import { Controller } from "react-hook-form";
import type { Control, FieldValues, Path } from "react-hook-form";

// ↓ ポイント1: 型定義をジェネリックにする
type AccountTextFieldProps<T extends FieldValues> = {
  id: string;
  name: Path<T>; // 'string'から'Path<T>'に変更
  control: Control<T>; // 'Control<FieldValues>'から'Control<T>'に変更
  label: string;
  secondaryLabel?: string;
  type: string;
  error?: string;
  icon: React.ReactNode;
  disabled: boolean;
};

// ↓ ポイント2: コンポーネント自体をジェネリックにする
const AccountTextField = <T extends FieldValues>({
  name,
  control,
  label,
  secondaryLabel = "",
  type,
  error = "",
  icon,
  disabled,
}: AccountTextFieldProps<T>) => {
  // ← ここにも <T> を追加
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          fullWidth
          type={type}
          label={label}
          placeholder={secondaryLabel}
          disabled={disabled}
          error={!!error}
          helperText={error}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">{icon}</InputAdornment>
            ),
          }}
        />
      )}
    />
  );
};

export default AccountTextField;

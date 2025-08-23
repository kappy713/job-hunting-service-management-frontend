// src/routes/register.tsx
import { useEffect, useState } from "react";
import RegistrationForm from "../components/RegistrationForm";
import type { Form } from "../types";
import { INITIAL_FORM } from "../constants";

function Register() {
  const [formData, setFormData] = useState<Form>(INITIAL_FORM);

  // 起動時に保存データを復元
  useEffect(() => {
    const saved = localStorage.getItem("es-data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Partial<Form>;
        setFormData({ ...INITIAL_FORM, ...parsed });
      } catch {
        setFormData({ ...INITIAL_FORM });
      }
    }
  }, []);

  // 入力が変わるたびに保存
  useEffect(() => {
    localStorage.setItem("es-data", JSON.stringify(formData));
  }, [formData]);

  const handleRegister = () => {
    console.log("Registration submitted:", formData);
    // ここで実際の登録処理を行う
    alert("登録が完了しました！");
  };

  return (
    <RegistrationForm
      form={formData}
      setForm={setFormData}
      onRegister={handleRegister}
    />
  );
}

export default Register;

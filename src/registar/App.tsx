// src/registar/App.tsx
import React, { useEffect, useState } from "react";
import RegistrationForm from "./RegistrationForm";
import type { Form } from "../types";
import { INITIAL_FORM } from "./constants";
import "./App.css";

function App() {
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

  return (
    <RegistrationForm
      form={formData}
      setForm={setFormData}
    />
  );
}

export default App;

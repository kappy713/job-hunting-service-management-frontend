// src/App.jsx
import React, { useEffect, useState } from "react";
import RegistrationForm from "./RegistrationForm"; // パスは配置に合わせて

// どこからでも共通で使える初期値
export const INITIAL_FORM = {
  lastName: "",
  firstName: "",
  lastNameKana: "",
  firstNameKana: "",
  birthDate: "",
  university: "",
  grade: "",
  faculty: "",
  department: "",
  track: "",
  seminar: "",
  jobs: [],            // 複数選択想定
  selfPr: "",          // ★ 追加
  gakuchika: "",       // ★ 追加
  research: "",        // ★ 追加
};

function App() {
  const [formData, setFormData] = useState(INITIAL_FORM);

  // 起動時にローカル保存から復元
  useEffect(() => {
    const saved = localStorage.getItem("es-data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData({ ...INITIAL_FORM, ...parsed });
      } catch {
        setFormData({ ...INITIAL_FORM });
      }
    }
  }, []);

  // 入力が変わるたびにローカル保存
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

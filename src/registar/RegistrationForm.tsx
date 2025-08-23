// src/registar/RegistrationForm.tsx
import React, { useMemo, useState } from "react";
import "./App.css";
import type { Form } from "../types";

type Props = {
  form: Form;
  setForm: React.Dispatch<React.SetStateAction<Form>>;
  onRegister?: () => void;
};

const ALL_GRADES = [
  "学部1年","学部2年","学部3年","学部4年",
  "修士1年","修士2年",
  "博士1年","博士2年","博士3年","既卒",
] as const;

const ALL_TRACKS = [
  "理工系","情報系","経済系","経営・商学系","文系",
  "教育系","医・看護系","薬学系","農学系","芸術・デザイン系","その他",
] as const;

const ALL_AGES = Array.from({ length: 23 }, (_, i) => 18 + i);
const ALL_JOBS = ["エンジニア"] as const;

export default function RegistrationForm({ form, setForm, onRegister }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (key: keyof Form, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const isDate = (s?: string) => {
    if (!s) return false;
    const m = String(s).match(/^(\d{4})\/(\d{2})\/(\d{2})$/);
    if (!m) return false;
    const d = new Date(`${m[1]}-${m[2]}-${m[3]}`);
    return !Number.isNaN(d.getTime());
  };

  const validate = (f: Form) => {
    const e: Record<string, string> = {};
    if (!f.lastName?.trim()) e.lastName = "姓は必須です";
    if (!f.firstName?.trim()) e.firstName = "名は必須です";

    if (!f.birthDate?.trim()) e.birthDate = "生年月日は必須です";
    else if (!isDate(f.birthDate)) e.birthDate = "正しい日付を入力";

    if (!f.age) e.age = "年齢を選択してください";

    if (!f.university?.trim()) e.university = "大学名は必須です";
    if (!f.grade) e.grade = "学年を選択してください";
    if (!f.faculty?.trim()) e.faculty = "学部は必須です";
    if (!f.track) e.track = "学部・学科系統を選択してください";
    if (!f.jobs) e.jobs = "目指す職種を選択してください";
    return e;
  };

  const isInvalid = useMemo(() => Object.keys(validate(form)).length > 0, [form]);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const v = validate(form);
    setErrors(v);
    setSubmitted(true);
    if (Object.keys(v).length === 0) onRegister?.();
  };

  const toSlashYMD = (raw: string) => {
    let s = String(raw).replace(/[^\d]/g, "");
    if (s.length >= 5) s = s.slice(0, 4) + "/" + s.slice(4);
    if (s.length >= 8) s = s.slice(0, 7) + "/" + s.slice(7, 9);
    return s.slice(0, 10);
  };

  const handleBirthDateChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const formatted = toSlashYMD(e.target.value);
    handleChange("birthDate", formatted);
  };

  return (
    <div className="page">
      <header className="topbar">
        <div className="topbar__inner">
          <h1 className="topbar__title">キャリマネ</h1>
        </div>
      </header>

      <main className="container">
        <form className="card" onSubmit={onSubmit}>
          <h2 className="sectionTitle">会員情報</h2>

          <div className="grid">
            {/* 姓 */}
            <div className="field half">
              <label className="label">姓 <span className="req">*</span></label>
              <input
                className="input"
                placeholder="例：山田"
                value={form.lastName || ""}
                onChange={(e) => handleChange("lastName", e.target.value)}
              />
              {errors.lastName && <p className="error">{errors.lastName}</p>}
            </div>

            {/* 名 */}
            <div className="field half">
              <label className="label">名 <span className="req">*</span></label>
              <input
                className="input"
                placeholder="例：太郎"
                value={form.firstName || ""}
                onChange={(e) => handleChange("firstName", e.target.value)}
              />
              {errors.firstName && <p className="error">{errors.firstName}</p>}
            </div>

            {/* 生年月日 */}
            <div className="field center">
              <label className="label">生年月日 <span className="req">*</span></label>
              <input
                type="text"
                className="input"
                placeholder="例：2004/01/01"
                value={form.birthDate || ""}
                onChange={handleBirthDateChange}
                inputMode="numeric"
                maxLength={10}
              />
              {errors.birthDate && <p className="error">{errors.birthDate}</p>}
            </div>

            {/* 年齢 */}
            <div className="field center">
              <label className="label">年齢 <span className="req">*</span></label>
              <select
                className="select"
                value={form.age ?? ""}
                onChange={(e) => handleChange("age", e.target.value)}
              >
                <option value="">選択してください</option>
                {ALL_AGES.map((a) => (
                  <option key={a} value={a}>{a}歳</option>
                ))}
              </select>
              {errors.age && <p className="error">{errors.age}</p>}
            </div>

            {/* 大学名 */}
            <div className="field center">
              <label className="label">大学名 <span className="req">*</span></label>
              <input
                className="input"
                placeholder="例：東京大学"
                value={form.university || ""}
                onChange={(e) => handleChange("university", e.target.value)}
              />
              {errors.university && <p className="error">{errors.university}</p>}
            </div>

            {/* 学年 */}
            <div className="field center">
              <label className="label">学年 <span className="req">*</span></label>
              <select
                className="select"
                value={form.grade || ""}
                onChange={(e) => handleChange("grade", e.target.value)}
              >
                <option value="">選択してください</option>
                {ALL_GRADES.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              {errors.grade && <p className="error">{errors.grade}</p>}
            </div>

            {/* 学部 */}
            <div className="field center">
              <label className="label">学部 <span className="req">*</span></label>
              <input
                className="input"
                placeholder="例：理工学部"
                value={form.faculty || ""}
                onChange={(e) => handleChange("faculty", e.target.value)}
              />
              {errors.faculty && <p className="error">{errors.faculty}</p>}
            </div>

            {/* 学部・学科系統 */}
            <div className="field center">
              <label className="label">学部・学科系統 <span className="req">*</span></label>
              <select
                className="select"
                value={form.track || ""}
                onChange={(e) => handleChange("track", e.target.value)}
              >
                <option value="">選択してください</option>
                {ALL_TRACKS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {errors.track && <p className="error">{errors.track}</p>}
            </div>

            {/* 目指す職種 */}
            <div className="row-single">
              <div className="field center">
                <label className="label">目指す職種 <span className="req">*</span></label>
                <select
                  className="jobs"
                  value={form.jobs || ""}
                  onChange={(e) => setForm({ ...form, jobs: e.target.value })}
                >
                  <option value="">選択してください</option>
                  {ALL_JOBS.map((job) => (
                    <option key={job} value={job}>{job}</option>
                  ))}
                </select>
                {errors.jobs && <p className="error">{errors.jobs}</p>}
              </div>
            </div>
          </div>

          <div className="actions">
            <button
              type="submit"
              className="btnPrimary"
              disabled={isInvalid}
              title={isInvalid ? "未入力/エラーを修正してください" : "送信"}
              onClick={() => setSubmitted(true)}
            >
              登録
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

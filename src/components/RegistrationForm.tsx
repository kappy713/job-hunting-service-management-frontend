// src/components/RegistrationForm.tsx
import React, { useMemo, useState } from "react";
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

  const handleChange = (key: keyof Form, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const isDate = (s?: string) => {
    if (!s) return false;
    const m = String(s).match(/^(\d{4})-(\d{2})-(\d{2})$/);
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
    if (Object.keys(v).length === 0) onRegister?.();
  };

  const toHyphenYMD = (raw: string) => {
    let s = String(raw).replace(/[^\d]/g, "");
    if (s.length >= 5) s = s.slice(0, 4) + "-" + s.slice(4);
    if (s.length >= 8) s = s.slice(0, 7) + "-" + s.slice(7, 9);
    return s.slice(0, 10);
  };

  const handleBirthDateChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const formatted = toHyphenYMD(e.target.value);
    handleChange("birthDate", formatted);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-500 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-white py-4 text-center">キャリマネ</h1>
        </div>
      </header>

      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <form className="bg-white shadow-lg rounded-lg p-6 sm:p-8" onSubmit={onSubmit}>
            <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">会員情報</h2>

            <div className="space-y-6">
              {/* 姓・名 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    姓 <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="例：山田"
                    value={form.lastName || ""}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="例：太郎"
                    value={form.firstName || ""}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>
              </div>

              {/* 生年月日・年齢 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    生年月日 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="例：2000-01-01"
                    value={form.birthDate || ""}
                    onChange={handleBirthDateChange}
                    inputMode="numeric"
                    maxLength={10}
                  />
                  {errors.birthDate && <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    年齢 <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white"
                    value={form.age ?? ""}
                    onChange={(e) => handleChange("age", e.target.value)}
                  >
                    <option value="">選択してください</option>
                    {ALL_AGES.map((a) => (
                      <option key={a} value={a}>{a}歳</option>
                    ))}
                  </select>
                  {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
                </div>
              </div>

              {/* 大学名・学年 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    大学名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="例：東京大学"
                    value={form.university || ""}
                    onChange={(e) => handleChange("university", e.target.value)}
                  />
                  {errors.university && <p className="text-red-500 text-sm mt-1">{errors.university}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    学年 <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white"
                    value={form.grade || ""}
                    onChange={(e) => handleChange("grade", e.target.value)}
                  >
                    <option value="">選択してください</option>
                    {ALL_GRADES.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                  {errors.grade && <p className="text-red-500 text-sm mt-1">{errors.grade}</p>}
                </div>
              </div>

              {/* 学部・学科系統 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    学部 <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="例：理工学部"
                    value={form.faculty || ""}
                    onChange={(e) => handleChange("faculty", e.target.value)}
                  />
                  {errors.faculty && <p className="text-red-500 text-sm mt-1">{errors.faculty}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    学部・学科系統 <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white"
                    value={form.track || ""}
                    onChange={(e) => handleChange("track", e.target.value)}
                  >
                    <option value="">選択してください</option>
                    {ALL_TRACKS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  {errors.track && <p className="text-red-500 text-sm mt-1">{errors.track}</p>}
                </div>
              </div>

              {/* 目指す職種 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  目指す職種 <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white"
                  value={form.jobs || ""}
                  onChange={(e) => setForm({ ...form, jobs: e.target.value })}
                >
                  <option value="">選択してください</option>
                  {ALL_JOBS.map((job) => (
                    <option key={job} value={job}>{job}</option>
                  ))}
                </select>
                {errors.jobs && <p className="text-red-500 text-sm mt-1">{errors.jobs}</p>}
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none"
                disabled={isInvalid}
                title={isInvalid ? "未入力/エラーを修正してください" : "送信"}
              >
                登録
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

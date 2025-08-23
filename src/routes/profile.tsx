// src/routes/profile.tsx
import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { Profile, ProfileData } from "../types";
import { profileAPI } from "../api/profile";

// --------------------------------------------------
// ローカルストレージ保存時のキー名（バージョン付け）
// --------------------------------------------------
const STORAGE_KEY = "mypage.profile.v2";

// --------------------------------------------------
// プロフィール入力の初期値（フォームの型を固定）
// --------------------------------------------------
const DEFAULT_PROFILE: Profile = {
  // テキスト系の大項目
  careerVision: "", // キャリアビジョン
  selfPR: "",       // 自己PR
  gakuchika: "",    // ガクチカ
  research: "",     // 研究内容

  // 追加：以下4つをテキストエリア形式で保持
  activities: "",          // 部活・サークル・団体活動経験
  desiredRolesText: "",    // 希望職種（テキスト）
  companyAxesText: "",     // 企業選びの軸（テキスト）
  idealEngineer: "",       // 理想のエンジニア像（テキスト）

  // 制作物・開発経験（カード配列） ← 簡略版（overview / techStack のみ表示）
  works: [{ overview: "", techStack: "", otherUrl: "" }],

  // ★ スキル（配列）：インターン形式のカードUIに合わせた2項目
  skills: [{ name: "", description: "" }],

  // 経験（サポーターズ風：インターン配列、ほか汎用配列）
  experiences: {
    internships: [{ org: "", period: "", details: "" }],
    parttime: [{ org: "", role: "", period: "", details: "" }],
    activities: [{ org: "", role: "", period: "", details: "" }],
  },

  // 資格の配列 ← インターン形式（カードUI）で name + description
  certifications: [{ name: "", description: "" }],

  // 旧：希望・軸（タグ）→ 今回はテキストエリアに置換（フィールドは残すが未使用）
  desiredRoles: [],
  companyAxes: [],
};

// --------------------------------------------------
// フロントエンドのProfile型をバックエンドのProfileData型に変換する関数
// --------------------------------------------------
function convertToProfileData(profile: Profile): ProfileData {
  // 制作物・開発経験を配列に変換
  const products = profile.works.map(work => work.overview).filter(Boolean);
  const productDescriptions = profile.works.map(work => `技術スタック: ${work.techStack}\nその他URL: ${work.otherUrl}`).filter(desc => desc.trim() !== "技術スタック: \nその他URL: ");

  // スキルを配列に変換
  const skills = profile.skills.map(skill => skill.name).filter(Boolean);
  const skillDescriptions = profile.skills.map(skill => skill.description).filter(Boolean);

  // インターン・アルバイト経験を配列に変換
  const allInterns = [
    ...profile.experiences.internships.map(intern => `${intern.org} (${intern.period})`),
    ...profile.experiences.parttime.map(part => `${part.org} - ${part.role} (${part.period})`),
    ...profile.experiences.activities.map(act => `${act.org} - ${act.role} (${act.period})`)
  ].filter(Boolean);

  const internDescriptions = [
    ...profile.experiences.internships.map(intern => intern.details),
    ...profile.experiences.parttime.map(part => part.details),
    ...profile.experiences.activities.map(act => act.details)
  ].filter(Boolean);

  // 資格を配列に変換
  const certifications = profile.certifications.map(cert => cert.name).filter(Boolean);
  const certificationDescriptions = profile.certifications.map(cert => cert.description).filter(Boolean);

  return {
    career_vision: profile.careerVision,
    self_promotion: profile.selfPR,
    student_experience: profile.gakuchika,
    research: profile.research,
    products,
    product_descriptions: productDescriptions,
    skills,
    skill_descriptions: skillDescriptions,
    interns: allInterns,
    intern_descriptions: internDescriptions,
    organization: profile.activities,
    certifications,
    certification_descriptions: certificationDescriptions,
    desired_job_type: profile.desiredRolesText,
    company_selection_criteria: profile.companyAxesText,
    engineer_aspiration: profile.idealEngineer,
  };
}

/* ==================================================
 * 最小入力コンポーネント群
 * - TextInput: 1行入力
 * - TextArea : 複数行
 * ================================================== */

// 1行テキスト入力
function TextInput({ value, onChange, placeholder, type = "text", maxLength }: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  maxLength?: number;
}) {
  return (
    <input
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      type={type}
      maxLength={maxLength}
    />
  );
}

// 複数行テキスト入力（maxLength対応）
function TextArea({ value, onChange, placeholder, rows = 5, maxLength }: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
}) {
  const v = value ?? "";
  const handle = (nv: string) => onChange(nv);

  return (
    <div>
      <textarea
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-y min-h-[140px]"
        value={v}
        onChange={(e) => handle(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
      />
    </div>
  );
}

/* ==================================================
 * 制作物（WorkCard/WorkListEditor）
 * - 簡略UI（概要/技術スタック）
 * ================================================== */

// 個々の制作物カード（簡略版）
function WorkCard({ work, onChange, onRemove }: {
  work: { overview: string; techStack: string; otherUrl: string };
  onChange: (work: { overview: string; techStack: string; otherUrl: string }) => void;
  onRemove: () => void;
}) {
  const set = (patch: Partial<typeof work>) => onChange({ ...work, ...patch });

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-center">
        <div className="font-semibold text-gray-800">制作物</div>
        <button 
          type="button" 
          className="text-red-600 hover:text-red-800 text-sm font-medium" 
          onClick={onRemove}
        >
          削除
        </button>
      </div>

      {/* 概要（200文字制限） */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">概要</label>
        <TextArea
          rows={3}
          value={work.overview}
          onChange={(v) => set({ overview: v })}
          placeholder={'（例）「カフェ探」地元のカフェ一覧を検索できるアプリです…'}
          maxLength={200}
        />
      </div>

      {/* 技術スタック（200文字制限） */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">技術スタック</label>
        <TextArea
          rows={3}
          value={work.techStack}
          onChange={(v) => set({ techStack: v })}
          placeholder={"（例）TypeScript + React / Go / Supabase など"}
          maxLength={200}
        />
      </div>
    </div>
  );
}

// 制作物のリスト（複数カードの追加・削除・編集）
function WorkListEditor({ value, onChange }: {
  value: Array<{ overview: string; techStack: string; otherUrl: string }>;
  onChange: (value: Array<{ overview: string; techStack: string; otherUrl: string }>) => void;
}) {
  const list = Array.isArray(value) ? value : [];
  const update = (i: number, nv: typeof list[0]) => onChange(list.map((w, idx) => (idx === i ? nv : w)));
  const add = () => onChange([...list, { overview: "", techStack: "", otherUrl: "" }]);
  const remove = (i: number) => onChange(list.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-4">
      {list.map((w, i) => (
        <WorkCard key={i} work={w} onChange={(nv) => update(i, nv)} onRemove={() => remove(i)} />
      ))}
      <button 
        type="button" 
        className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg py-3 px-4 text-gray-700 font-medium transition-colors"
        onClick={add}
      >
        ＋ 制作物を追加
      </button>
    </div>
  );
}

/* ==================================================
 * インターンシップ経験（InternCard/InternshipList）
 * ================================================== */

// 個々のインターンシップカード
function InternCard({ intern, onChange, onRemove }: {
  intern: { org: string; period: string; details: string };
  onChange: (intern: { org: string; period: string; details: string }) => void;
  onRemove: () => void;
}) {
  const set = (patch: Partial<typeof intern>) => onChange({ ...intern, ...patch });

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-center">
        <div className="font-semibold text-gray-800">インターン経験</div>
        <button 
          type="button" 
          className="text-red-600 hover:text-red-800 text-sm font-medium" 
          onClick={onRemove}
        >
          削除
        </button>
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">企業・団体名</label>
        <TextInput
          value={intern.org}
          onChange={(v) => set({ org: v })}
          placeholder="例：株式会社○○"
          maxLength={100}
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">期間</label>
        <TextInput
          value={intern.period}
          onChange={(v) => set({ period: v })}
          placeholder="例：2023年8月～2023年9月"
          maxLength={50}
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">詳細</label>
        <TextArea
          rows={4}
          value={intern.details}
          onChange={(v) => set({ details: v })}
          placeholder="担当業務、技術、成果、学びなどを記述してください"
          maxLength={500}
        />
      </div>
    </div>
  );
}

// インターンシップのリスト
function InternshipList({ value, onChange }: {
  value: Array<{ org: string; period: string; details: string }>;
  onChange: (value: Array<{ org: string; period: string; details: string }>) => void;
}) {
  const list = Array.isArray(value) ? value : [];
  const update = (i: number, nv: typeof list[0]) => onChange(list.map((item, idx) => (idx === i ? nv : item)));
  const add = () => onChange([...list, { org: "", period: "", details: "" }]);
  const remove = (i: number) => onChange(list.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-4">
      {list.map((item, i) => (
        <InternCard key={i} intern={item} onChange={(nv) => update(i, nv)} onRemove={() => remove(i)} />
      ))}
      <button 
        type="button" 
        className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg py-3 px-4 text-gray-700 font-medium transition-colors"
        onClick={add}
      >
        ＋ インターン経験を追加
      </button>
    </div>
  );
}

/* ==================================================
 * スキル（SkillCard/SkillListEditor）
 * ================================================== */

// 個々のスキルカード
function SkillCard({ skill, onChange, onRemove }: {
  skill: { name: string; description: string };
  onChange: (skill: { name: string; description: string }) => void;
  onRemove: () => void;
}) {
  const set = (patch: Partial<typeof skill>) => onChange({ ...skill, ...patch });

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-center">
        <div className="font-semibold text-gray-800">スキル</div>
        <button 
          type="button" 
          className="text-red-600 hover:text-red-800 text-sm font-medium" 
          onClick={onRemove}
        >
          削除
        </button>
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">スキル名</label>
        <TextInput
          value={skill.name}
          onChange={(v) => set({ name: v })}
          placeholder="例：JavaScript"
          maxLength={50}
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">説明</label>
        <TextArea
          rows={3}
          value={skill.description}
          onChange={(v) => set({ description: v })}
          placeholder="習得レベル、使用経験、関連プロジェクトなど"
          maxLength={200}
        />
      </div>
    </div>
  );
}

// スキルのリスト
function SkillListEditor({ value, onChange }: {
  value: Array<{ name: string; description: string }>;
  onChange: (value: Array<{ name: string; description: string }>) => void;
}) {
  const list = Array.isArray(value) ? value : [];
  const update = (i: number, nv: typeof list[0]) => onChange(list.map((item, idx) => (idx === i ? nv : item)));
  const add = () => onChange([...list, { name: "", description: "" }]);
  const remove = (i: number) => onChange(list.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-4">
      {list.map((item, i) => (
        <SkillCard key={i} skill={item} onChange={(nv) => update(i, nv)} onRemove={() => remove(i)} />
      ))}
      <button 
        type="button" 
        className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg py-3 px-4 text-gray-700 font-medium transition-colors"
        onClick={add}
      >
        ＋ スキルを追加
      </button>
    </div>
  );
}

/* ==================================================
 * 資格（CertCard/CertListEditor）
 * ================================================== */

// 個々の資格カード
function CertCard({ cert, onChange, onRemove }: {
  cert: { name: string; description: string };
  onChange: (cert: { name: string; description: string }) => void;
  onRemove: () => void;
}) {
  const set = (patch: Partial<typeof cert>) => onChange({ ...cert, ...patch });

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-center">
        <div className="font-semibold text-gray-800">資格</div>
        <button 
          type="button" 
          className="text-red-600 hover:text-red-800 text-sm font-medium" 
          onClick={onRemove}
        >
          削除
        </button>
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">資格名</label>
        <TextInput
          value={cert.name}
          onChange={(v) => set({ name: v })}
          placeholder="例：基本情報技術者試験"
          maxLength={100}
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">説明</label>
        <TextArea
          rows={3}
          value={cert.description}
          onChange={(v) => set({ description: v })}
          placeholder="取得年月、級・レベル、関連スキルなど"
          maxLength={200}
        />
      </div>
    </div>
  );
}

// 資格のリスト
function CertListEditor({ value, onChange }: {
  value: Array<{ name: string; description: string }>;
  onChange: (value: Array<{ name: string; description: string }>) => void;
}) {
  const list = Array.isArray(value) ? value : [];
  const update = (i: number, nv: typeof list[0]) => onChange(list.map((item, idx) => (idx === i ? nv : item)));
  const add = () => onChange([...list, { name: "", description: "" }]);
  const remove = (i: number) => onChange(list.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-4">
      {list.map((item, i) => (
        <CertCard key={i} cert={item} onChange={(nv) => update(i, nv)} onRemove={() => remove(i)} />
      ))}
      <button 
        type="button" 
        className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg py-3 px-4 text-gray-700 font-medium transition-colors"
        onClick={add}
      >
        ＋ 資格を追加
      </button>
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_PROFILE;
  });

  // 直近「保存」した内容を保持（初期値は起動時の保存値）
  const [lastSaved, setLastSaved] = useState<Profile>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_PROFILE;
  });

  // 入力変更ごとに自動保存（従来どおり）
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  // 未保存の変更があるか（= 保存可能か）
  const isSavable = useMemo(() => {
    try {
      return JSON.stringify(profile) !== JSON.stringify(lastSaved);
    } catch {
      return true;
    }
  }, [profile, lastSaved]);

  const set = useCallback((path: string[], val: string | string[] | number | object) => {
    setProfile((p: Profile) => {
      const next = JSON.parse(JSON.stringify(p)) as Profile;
      let cur: Record<string, unknown> = next as Record<string, unknown>;
      for (let i = 0; i < path.length - 1; i++) {
        cur = cur[path[i]] as Record<string, unknown>;
      }
      cur[path[path.length - 1]] = val;
      return next;
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // フロントエンド形式の保存
      console.log("フロントエンド形式のプロフィール:", profile);
      
      // バックエンド形式に変換
      const backendProfileData = convertToProfileData(profile);
      console.log("バックエンド送信用プロフィール:", backendProfileData);
      
      // バックエンドAPIに送信
      await profileAPI.createOrUpdate(backendProfileData);
      
      // ローカルストレージにも保存（将来のAPI送信用）
      localStorage.setItem('userProfileData', JSON.stringify(backendProfileData));
      
      console.log("プロフィールを保存しました！");
      setLastSaved(profile); // 保存基準を更新 → ボタンがグレーに戻る
      
      // register-servicesページに遷移
      navigate('/register-services');
    } catch (error) {
      console.error("プロフィール保存エラー:", error);
      console.error(`保存に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-500 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-white py-4 text-center">キャリマネ</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 pb-20">
        {/* ← HTML5の自動バリデーションを無効化 */}
        <form noValidate onSubmit={handleSubmit} className="space-y-6">
          {/* キャリア・自己PRなど */}
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">キャリア・自己PRなど</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
            <div>
              <label className="block text-sm text-gray-600 mb-2">キャリアイメージ</label>
              <TextArea 
                value={profile.careerVision} 
                onChange={(v) => set(["careerVision"], v)} 
                rows={8} 
                maxLength={2000} 
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">自己PR</label>
              <TextArea 
                value={profile.selfPR} 
                onChange={(v) => set(["selfPR"], v)} 
                rows={8} 
                maxLength={2000} 
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">ガクチカ</label>
              <TextArea 
                value={profile.gakuchika} 
                onChange={(v) => set(["gakuchika"], v)} 
                rows={8} 
                maxLength={2000} 
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">研究内容</label>
              <TextArea 
                value={profile.research} 
                onChange={(v) => set(["research"], v)} 
                rows={8} 
                maxLength={2000} 
              />
            </div>
          </div>

          {/* インターン・開発アルバイト経験 */}
          <div className="h-px bg-gray-200 my-6" />
          <h2 className="text-xl font-semibold text-gray-800 mb-3">インターン・開発アルバイト経験</h2>
          <InternshipList
            value={profile.experiences.internships}
            onChange={(v) => set(["experiences", "internships"], v)}
          />

          {/* 制作物・開発経験（簡略版） */}
          <div className="h-px bg-gray-200 my-6" />
          <h2 className="text-xl font-semibold text-gray-800 mb-3">制作物・開発経験</h2>
          <WorkListEditor value={profile.works} onChange={(v) => set(["works"], v)} />

          {/* スキル（インターン形式：配列） */}
          <div className="h-px bg-gray-200 my-6" />
          <h2 className="text-xl font-semibold text-gray-800 mb-3">スキル</h2>
          <SkillListEditor value={profile.skills} onChange={(v) => set(["skills"], v)} />

          {/* 資格（インターン形式） */}
          <div className="h-px bg-gray-200 my-6" />
          <h2 className="text-xl font-semibold text-gray-800 mb-3">資格</h2>
          <CertListEditor value={profile.certifications} onChange={(v) => set(["certifications"], v)} />

          {/* 活動・志向（キャリア系と同じカード形式） */}
          <div className="h-px bg-gray-200 my-6" />
          <h2 className="text-xl font-semibold text-gray-800 mb-3">活動・志向</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
            <div>
              <label className="block text-sm text-gray-600 mb-2">部活・サークル・団体活動経験</label>
              <TextArea
                value={profile.activities}
                onChange={(v) => set(["activities"], v)}
                rows={8}
                maxLength={2000}
                placeholder={"所属団体、役割、期間、取り組み、成果などを自由に記述してください。"}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">希望職種</label>
              <TextArea
                value={profile.desiredRolesText}
                onChange={(v) => set(["desiredRolesText"], v)}
                rows={8}
                maxLength={2000}
                placeholder={"志望職種やその理由、興味分野、将来のキャリアとのつながり等。"}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">企業選びの軸</label>
              <TextArea
                value={profile.companyAxesText}
                onChange={(v) => set(["companyAxesText"], v)}
                rows={8}
                maxLength={2000}
                placeholder={"価値観や重視する条件（技術文化、裁量、社会課題、勤務地、報酬 等）。"}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">理想のエンジニア像</label>
              <TextArea
                value={profile.idealEngineer}
                onChange={(v) => set(["idealEngineer"], v)}
                rows={8}
                maxLength={2000}
                placeholder={"どんな課題にどう向き合うエンジニアになりたいか、スキル/姿勢/影響など。"}
              />
            </div>
          </div>

          {/* 保存バー */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
            <div className="max-w-4xl mx-auto flex justify-end">
              <button
                type="submit"
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  isSavable
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-400 text-white cursor-not-allowed"
                }`}
                disabled={!isSavable}
                title={isSavable ? "保存できます" : "変更がありません"}
              >
                保存
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// React の基本フック useState, useEffect をインポート
import React, { useEffect, useMemo, useState } from "react";
// 画面スタイルを読み込み
import "./App.css";

// --------------------------------------------------
// ローカルストレージ保存時のキー名（バージョン付け）
// --------------------------------------------------
const STORAGE_KEY = "mypage.profile.v2";

// --------------------------------------------------
// プロフィール入力の初期値（フォームの型を固定）
// --------------------------------------------------
const DEFAULT_PROFILE = {
  // 基本情報（今回は画面に出していないが、将来的に利用できる形で保持）
  basic: {
    name: "",
    university: "",
    department: "",
    grade: "",
    email: "",
    links: [{ label: "", url: "" }], // 任意のリンク（ポートフォリオなど）
  },
  // テキスト系の大項目
  careerVision: "", // キャリアイメージ
  selfPR: "",       // 自己PR
  gakuchika: "",    // 学チカ
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

/* ==================================================
 * 最小入力コンポーネント群
 * - TextInput: 1行入力
 * - TextArea : 複数行
 * ================================================== */

// 1行テキスト入力
function TextInput({ value, onChange, placeholder, type = "text", maxLength }) {
  return (
    <input
      className="input"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      type={type}
      maxLength={maxLength}
    />
  );
}

// 複数行テキスト入力（maxLength対応）
function TextArea({ value, onChange, placeholder, rows = 5, maxLength }) {
  const v = value ?? "";
  const handle = (nv) => onChange(nv);

  return (
    <div>
      <textarea
        className="textarea textarea-large"
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
function WorkCard({ work, onChange, onRemove }) {
  const set = (patch) => onChange({ ...work, ...patch });

  return (
    <div className="card vstack">
      <div className="section-head">
        <div className="section-title">制作物</div>
        <button type="button" className="link-danger" onClick={onRemove}>削除</button>
      </div>

      {/* 概要（200文字制限） */}
      <label className="label">概要</label>
      <TextArea
        rows={3}
        value={work.overview}
        onChange={(v) => set({ overview: v })}
        placeholder={'（例）「カフェ探」地元のカフェ一覧を検索できるアプリです…'}
        maxLength={200}
      />

      {/* 技術スタック（200文字制限） */}
      <label className="label">技術スタック</label>
      <TextArea
        rows={3}
        value={work.techStack}
        onChange={(v) => set({ techStack: v })}
        placeholder={"（例）TypeScript + React / Go / Supabase など"}
        maxLength={200}
      />
    </div>
  );
}

// 制作物のリスト（複数カードの追加・削除・編集）
function WorkListEditor({ value, onChange }) {
  const list = Array.isArray(value) ? value : [];
  const update = (i, nv) => onChange(list.map((w, idx) => (idx === i ? nv : w)));
  const add = () => onChange([...list, { overview: "", techStack: "", otherUrl: "" }]);
  const remove = (i) => onChange(list.filter((_, idx) => idx !== i));

  return (
    <div className="vstack">
      {list.map((w, i) => (
        <WorkCard key={i} work={w} onChange={(nv) => update(i, nv)} onRemove={() => remove(i)} />
      ))}
      <button type="button" className="btn btn-add" onClick={add}>＋ 制作物を追加</button>
    </div>
  );
}

/* ==================================================
 * インターン・開発アルバイト（サポーターズ風 UI）
 * ================================================== */

function InternshipList({ value, onChange }) {
  const list = Array.isArray(value) ? value : [];
  const add = () => onChange([...list, { org: "", period: "", details: "" }]);
  const remove = (i) => onChange(list.filter((_, idx) => idx !== i));
  const update = (i, patch) => onChange(list.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));

  return (
    <div className="vstack">
      {list.map((ex, i) => (
        <div key={i} className="card vstack">
          <div className="section-head">
            <div className="section-title">インターン・開発アルバイト経験</div>
            <button type="button" className="link-danger" onClick={() => remove(i)}>削除</button>
          </div>

          <label className="label">インターン・開発アルバイト先</label>
          <TextInput
            value={ex.org}
            onChange={(v) => update(i, { org: v })}
            placeholder="（例）株式会社サポーターズ"
          />

          {/* 期間を使いたくなったらコメントを外してください
          <label className="label">期間</label>
          <TextInput
            value={ex.period}
            onChange={(v) => update(i, { period: v })}
            placeholder="例：2025.04 〜 現在"
          />
          */}

          <label className="label">担当業務・役割</label>
          <TextArea
            rows={8}
            value={ex.details}
            onChange={(v) => update(i, { details: v })}
            placeholder={"例：新規機能の設計・実装、データ分析（Python, SQL）、ユーザーインタビュー、テスト自動化、運用改善など"}
            maxLength={2000}
          />
        </div>
      ))}

      <button type="button" className="btn btn-add" onClick={add}>＋ インターン経験を追加</button>
    </div>
  );
}

/* ==================================================
 * スキル（配列）編集：インターン形式（2項目）
 * ================================================== */
function SkillListEditor({ value, onChange }) {
  const list = Array.isArray(value) ? value : [];
  const add = () => onChange([...list, { name: "", description: "" }]);
  const remove = (i) => onChange(list.filter((_, idx) => idx !== i));
  const update = (i, patch) => onChange(list.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));

  return (
    <div className="vstack">
      {list.map((skill, i) => (
        <div key={i} className="card vstack">
          <div className="section-head">
            <div className="section-title">スキル</div>
            <button type="button" className="link-danger" onClick={() => remove(i)}>削除</button>
          </div>

          <label className="label">言語・フレームワーク名</label>
          <TextInput
            value={skill.name}
            onChange={(v) => update(i, { name: v })}
            placeholder="例：Python / React / Go など"
          />

          <label className="label">説明</label>
          <TextArea
            rows={3}
            value={skill.description}
            onChange={(v) => update(i, { description: v })}
            placeholder="例：業務でAPI開発経験 / 個人開発で半年利用 / データ分析で週3回使用"
          />
        </div>
      ))}
      <button type="button" className="btn btn-add" onClick={add}>＋ スキルを追加</button>
    </div>
  );
}

/* ==================================================
 * 汎用経験リスト（部活・活動などに流用可能）
 * ================================================== */
function ExperienceListEditor({ value, onChange, title }) {
  const list = Array.isArray(value) ? value : [];
  const update = (i, p) => onChange(list.map((v, idx) => (idx === i ? { ...v, ...p } : v)));
  const add = () => onChange([...list, { org: "", role: "", period: "", details: "" }]);
  const remove = (i) => onChange(list.filter((_, idx) => idx !== i));

  return (
    <div className="vstack">
      <div className="section-head">
        <div className="section-title">{title}</div>
      </div>

      {list.map((ex, i) => (
        <div key={i} className="card vstack">
          <div className="section-head">
            <div className="section-title">{title}</div>
            <button type="button" className="link-danger" onClick={() => remove(i)}>削除</button>
          </div>

          <label className="label">組織/企業</label>
          <TextInput value={ex.org} onChange={(v) => update(i, { org: v })} placeholder="例：◯◯株式会社 / ◯◯サークル" />

          <label className="label">役割</label>
          <TextInput value={ex.role} onChange={(v) => update(i, { role: v })} placeholder="例：インターン / 代表" />

          <label className="label">期間</label>
          <TextInput value={ex.period} onChange={(v) => update(i, { period: v })} placeholder="2025.01 - 2025.03" />

          <label className="label">内容</label>
          <TextArea rows={6} value={ex.details} onChange={(v) => update(i, { details: v })} />
        </div>
      ))}

      <button type="button" className="btn btn-add" onClick={add}>＋ {title}を追加</button>
    </div>
  );
}

/* ==================================================
 * 資格リスト編集（インターン形式：2項目／カード追加・削除）
 * ================================================== */
function CertListEditor({ value, onChange }) {
  const list = Array.isArray(value) ? value : [];

  // 行の追加・削除・更新
  const add = () => onChange([...list, { name: "", description: "" }]);
  const remove = (i) => onChange(list.filter((_, idx) => idx !== i));
  const update = (i, patch) =>
    onChange(list.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));

  return (
    <div className="vstack">
      {list.map((cert, i) => (
        <div key={i} className="card vstack">
          <div className="section-head">
            <div className="section-title">資格</div>
            <button type="button" className="link-danger" onClick={() => remove(i)}>削除</button>
          </div>

          <label className="label">資格名</label>
          <TextInput
            value={cert.name}
            onChange={(v) => update(i, { name: v })}
            placeholder="例：基本情報技術者試験 / TOEIC など"
          />

          <label className="label">説明</label>
          <TextArea
            rows={3}
            value={cert.description}
            onChange={(v) => update(i, { description: v })}
            placeholder="例：合格（2025.05）/ スコア 820 / 実務での活用ポイント 等"
          />
        </div>
      ))}

      {/* 追加ボタン */}
      <button type="button" className="btn btn-add" onClick={add}>＋ 資格を追加</button>
    </div>
  );
}

/* ==================================================
 * メインコンポーネント App
 * ================================================== */
export default function App() {
  const [profile, setProfile] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_PROFILE;
  });

  // 直近「保存」した内容を保持（初期値は起動時の保存値）
  const [lastSaved, setLastSaved] = useState(() => {
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

  const set = (path, val) => {
    setProfile((p) => {
      const next = JSON.parse(JSON.stringify(p));
      let cur = next;
      for (let i = 0; i < path.length - 1; i++) cur = cur[path[i]];
      cur[path[path.length - 1]] = val;
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("ES payload", profile);
    alert("保存しました（自動保存も有効）");
    setLastSaved(profile); // 保存基準を更新 → ボタンがグレーに戻る
  };

  return (
    <div className="page">
      <h1 className="page-title">キャリマネ</h1>
      <div className="page-divider" />

      {/* ← HTML5の自動バリデーションを無効化 */}
      <form noValidate onSubmit={handleSubmit} className="vstack gap">
        {/* キャリア・自己PRなど */}
        <h2 className="page-subtitle">キャリア・自己PRなど</h2>
        <div className="card vstack">
          <label className="label">キャリアイメージ</label>
          <TextArea value={profile.careerVision} onChange={(v) => set(["careerVision"], v)} rows={8} maxLength={2000} />

          <label className="label">自己PR</label>
          <TextArea value={profile.selfPR} onChange={(v) => set(["selfPR"], v)} rows={8} maxLength={2000} />

          <label className="label">ガクチカ</label>
          <TextArea value={profile.gakuchika} onChange={(v) => set(["gakuchika"], v)} rows={8} maxLength={2000} />

          <label className="label">研究内容</label>
          <TextArea value={profile.research} onChange={(v) => set(["research"], v)} rows={8} maxLength={2000} />
        </div>

        {/* インターン・開発アルバイト経験 */}
        <div className="page-divider" />
        <h2 className="page-subtitle">インターン・開発アルバイト経験</h2>
        <InternshipList
          value={profile.experiences.internships}
          onChange={(v) => set(["experiences", "internships"], v)}
        />

        {/* 制作物・開発経験（簡略版） */}
        <div className="page-divider" />
        <h2 className="page-subtitle">制作物・開発経験</h2>
        <WorkListEditor value={profile.works} onChange={(v) => set(["works"], v)} />

        {/* スキル（インターン形式：配列） */}
        <div className="page-divider" />
        <h2 className="page-subtitle">スキル</h2>
        <SkillListEditor value={profile.skills} onChange={(v) => set(["skills"], v)} />

        {/* 資格（インターン形式） */}
        <div className="page-divider" />
        <h2 className="page-subtitle">資格</h2>
        <CertListEditor value={profile.certifications} onChange={(v) => set(["certifications"], v)} />

        {/* 活動・志向（キャリア系と同じカード形式） */}
        <div className="page-divider" />
        <h2 className="page-subtitle">活動・志向</h2>
        <div className="card vstack">
          <label className="label">部活・サークル・団体活動経験</label>
          <TextArea
            value={profile.activities}
            onChange={(v) => set(["activities"], v)}
            rows={8}
            maxLength={2000}
            placeholder={"所属団体、役割、期間、取り組み、成果などを自由に記述してください。"}
          />

          <label className="label">希望職種</label>
          <TextArea
            value={profile.desiredRolesText}
            onChange={(v) => set(["desiredRolesText"], v)}
            rows={8}
            maxLength={2000}
            placeholder={"志望職種やその理由、興味分野、将来のキャリアとのつながり等。"}
          />

          <label className="label">企業選びの軸</label>
          <TextArea
            value={profile.companyAxesText}
            onChange={(v) => set(["companyAxesText"], v)}
            rows={8}
            maxLength={2000}
            placeholder={"価値観や重視する条件（技術文化、裁量、社会課題、勤務地、報酬 等）。"}
          />

          <label className="label">理想のエンジニア像</label>
          <TextArea
            value={profile.idealEngineer}
            onChange={(v) => set(["idealEngineer"], v)}
            rows={8}
            maxLength={2000}
            placeholder={"どんな課題にどう向き合うエンジニアになりたいか、スキル/姿勢/影響など。"}
          />
        </div>

        {/* 保存バー */}
        <div className="savebar">
          <button
            type="submit"
            className={`btn btn-save ${isSavable ? "is-active" : ""}`}
            disabled={!isSavable}
            aria-disabled={!isSavable}
            title={isSavable ? "保存できます" : "変更がありません"}
          >
            保存
          </button>
        </div>
      </form>
    </div>
  );
}

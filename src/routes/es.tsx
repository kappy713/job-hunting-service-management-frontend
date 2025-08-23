import { useState, useEffect } from "react";
import { FaPencilAlt, FaCopy, FaSave } from "react-icons/fa";
import { supabase } from "../utils/supabase"; // パスをエイリアスに変更
import type { User } from "@supabase/supabase-js";

// データ定義：コンポーネントの外に記述
const servicesData = [
  {
    id: "myES",
    name: "マイエントリーシート",
    fields: [
      {
        id: "self_promotion",
        label: "自己PR",
        charLimit: 0,
        recommended: "",
      },
    ],
  },
  {
    id: "mynavi",
    name: "マイナビ",
    fields: [
      {
        id: "self_promotion",
        label: "自己PR",
        charLimit: 1000,
        recommended: "",
      },
      {
        id: "future_plan",
        label: "保有資格、これから取り組みたいこと",
        charLimit: 300,
        recommended: "",
      },
    ],
  },
  {
    id: "levtech_rookie",
    name: "レバテックルーキー",
    fields: [
      {
        id: "desired_job_type",
        label: "志望職種",
        charLimit: 0,
        recommended: "",
      },
      {
        id: "career_aspiration",
        label: "どのようなエンジニアになりたいですか？",
        charLimit: 0,
        recommended: "",
      },
      {
        id: "interested_tasks",
        label: "どのような業務に関心がありますか？",
        charLimit: 0,
        recommended: "",
      },
      {
        id: "job_requirements",
        label: "就職先に求めること",
        charLimit: 0,
        recommended: "",
      },
      {
        id: "interested_industries",
        label: "興味のある業界",
        charLimit: 0,
        recommended: "",
      },
      {
        id: "preferred_company_size",
        label: "希望企業規模",
        charLimit: 0,
        recommended: "",
      },
      {
        id: "interested_business_types",
        label: "興味のある業態",
        charLimit: 0,
        recommended: "",
      },
      {
        id: "preferred_work_location",
        label: "希望勤務地",
        charLimit: 0,
        recommended: "",
      },
      {
        id: "skills",
        label: "プログラミング言語",
        charLimit: 0,
        recommended: "",
      },
      {
        id: "skill_descriptions",
        label: "経験",
        charLimit: 0,
        recommended: "",
      },
      {
        id: "portfolio",
        label: "ポートフォリオURL",
        charLimit: 0,
        recommended: "",
      },
      {
        id: "portfolio_description",
        label: "ポートフォリオの説明",
        charLimit: 0,
        recommended: "200文字以上推奨",
      },
      {
        id: "intern_experiences",
        label: "インターン経験",
        charLimit: 0,
        recommended: "",
      },
      {
        id: "intern_experience_descriptions",
        label: "取り組んだこと",
        charLimit: 0,
        recommended: "200文字以上推奨",
      },
      {
        id: "hackathon_experiences",
        label: "ハッカソン経験",
        charLimit: 0,
        recommended: "",
      },
      {
        id: "hackathon_experience_descriptions",
        label: "取り組んだこと",
        charLimit: 0,
        recommended: "200文字以上推奨",
      },
      {
        id: "research",
        label: "ガクチカ(研究)",
        charLimit: 500,
        recommended: "200文字以上推奨",
      },
      {
        id: "organization",
        label: "ガクチカ(所属団体)",
        charLimit: 500,
        recommended: "200文字以上推奨",
      },
      {
        id: "other",
        label: "ガクチカ(その他)",
        charLimit: 500,
        recommended: "200文字以上推奨",
      },
      {
        id: "certifications",
        label: "資格・その他スキル",
        charLimit: 0,
        recommended: "",
      },
      {
        id: "languages",
        label: "言語",
        charLimit: 0,
        recommended: "",
      },
      {
        id: "language_levels",
        label: "言語スキルレベル",
        charLimit: 0,
        recommended: "",
      },
    ],
  },
  {
    id: "one_career",
    name: "ワンキャリア",
    fields: [
      {
        id: "self_promotion",
        label: "自己PR",
        charLimit: 1000,
        recommended: "300~500文字推奨",
      },
      {
        id: "gakutika",
        label: "学生時代に頑張ったこと",
        charLimit: 1000,
        recommended: "300~500文字推奨",
      },
      {
        id: "resarches",
        label: "研究内容・ゼミ内容",
        charLimit: 1000,
        recommended: "300~500文字推奨",
      },
      {
        id: "future_plan",
        label: "将来像・目指すキャリア",
        charLimit: 1000,
        recommended: "300~500文字推奨",
      },
      {
        id: "products",
        label: "学生時代の活動実績",
        charLimit: 0,
        recommended: "",
      },
      {
        id: "intern_experiences",
        label: "インターン実績",
        charLimit: 0,
        recommended: "",
      },
      {
        id: "skills",
        label: "プログラミングスキル",
        charLimit: 300,
        recommended: "簡潔に",
      },
      {
        id: "languages",
        label: "言語レベル",
        charLimit: 300,
        recommended: "簡潔に",
      },
    ],
  },
  {
    id: "supporters",
    name: "サポーターズ",
    fields: [
      {
        id: "career_vision",
        label: "キャリア",
        charLimit: 200,
        recommended: "",
      },
      {
        id: "self_promotion",
        label: "自己PR",
        charLimit: 5000,
        recommended: "",
      },
      {
        id: "skills",
        label: "プログラミングスキル",
        charLimit: 500,
        recommended: "",
      },
      {
        id: "intern_experiences",
        label: "インターン経験",
        charLimit: 500,
        recommended: "",
      },
      {
        id: "products",
        label: "制作物",
        charLimit: 200,
        recommended: "",
      },
      {
        id: "product_tech_stacks",
        label: "技術スタック",
        charLimit: 200,
        recommended: "",
      },
      {
        id: "product_description",
        label: "あなたが担当した箇所や工夫した点、受賞歴など",
        charLimit: 500,
        recommended: "",
      },
      {
        id: "researches",
        label: "研究テーマ",
        charLimit: 0,
        recommended: "",
      },
      {
        id: "researche_descriptions",
        label: "研究内容",
        charLimit: 500,
        recommended: "",
      },
    ],
  },
  {
    id: "career_select",
    name: "キャリアセレクト",
    fields: [
      {
        id: "skills",
        label: "プログラミングスキル",
        charLimit: 0,
        recommended: "",
      },
      {
        id: "skill_description",
        label: "用途",
        charLimit: 0,
        recommended: "",
      },
      {
        id: "career_vision",
        label: "キャリアビジョン",
        charLimit: 0,
        recommended: "",
      },
      {
        id: "self_promotion",
        label: "自己PR",
        charLimit: 0,
        recommended: "",
      },
      {
        id: "research",
        label: "研究内容",
        charLimit: 500,
        recommended: "",
      },
      {
        id: "products",
        label: "開発物・開発経験",
        charLimit: 0,
        recommended: "",
      },
      {
        id: "experiences",
        label: "これまでの経験",
        charLimit: 0,
        recommended: "",
      },
      {
        id: "intern_experiences",
        label: "インターン・アルバイト",
        charLimit: 0,
        recommended: "",
      },
      {
        id: "certifications",
        label: "資格",
        charLimit: 0,
        recommended: "",
      },
    ],
  },
  {
    id: "gyakukyuujin_navi",
    name: "逆求人ナビ",
    fields: [
      {
        id: "self_pr",
        label: "自己PR",
        charLimit: 1000,
        recommended: "300-500文字推奨",
      },
      {
        id: "gakuchika",
        label: "学生時代に頑張ったこと",
        charLimit: 1000,
        recommended: "300-500文字推奨",
      },
    ],
  },
];

// 型定義
type FormState = {
  [serviceId: string]: {
    [fieldId: string]: string;
  };
};

type EditingState = {
  [serviceId: string]: {
    [fieldId: string]: boolean;
  };
};

// ★ APIレスポンスの型を定義
type LastUpdatedResponse = {
  [serviceId: string]: { [fieldId: string]: string };
};

// Reactコンポーネント
export default function ES() {
  // どのタブがアクティブかを記憶するState
  const [activeTab, setActiveTab] = useState(servicesData[0].id);
  // 全サービスの全テキスト情報を一元管理するState
  const [formTexts, setFormTexts] = useState<FormState>({});
  // どのテキストエリアが編集モードかを管理するState
  const [editingFields, setEditingFields] = useState<EditingState>({});

  const [lastUpdated, setLastUpdated] = useState<LastUpdatedResponse>({});
  const [user, setUser] = useState<User | null>(null);

  // ユーザー情報の取得と、最終更新日時を取得
  useEffect(() => {
    async function fetchData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // ここでAPIを呼び出し、レスポンス例のデータを取得する
        // 今回はダミーデータとして直接セットします
        const dummyResponse: LastUpdatedResponse = {
          mynavi: { self_promotion: "2025-08-23T10:30:00+09:00" },
          levtech_rookie: { desired_job_type: "2025-08-22T14:00:00+09:00" },
        };
        setLastUpdated(dummyResponse);
      }
    }
    fetchData();
  }, []);

  // --- イベントハンドラー関数 ---
  const handleTextChange = (
    serviceId: string,
    fieldId: string,
    text: string
  ) => {
    setFormTexts((prev) => ({
      ...prev,
      [serviceId]: { ...prev[serviceId], [fieldId]: text },
    }));
  };

  const handleEditClick = (serviceId: string, fieldId: string) => {
    setEditingFields((prev) => ({
      ...prev,
      [serviceId]: { ...prev[serviceId], [fieldId]: true },
    }));
  };

  const handleSaveClick = (serviceId: string, fieldId: string) => {
    setEditingFields((prev) => ({
      ...prev,
      [serviceId]: { ...prev[serviceId], [fieldId]: false },
    }));
    const textToSave = formTexts[serviceId]?.[fieldId] || "";
    console.log(`保存するテキスト (${serviceId} - ${fieldId}): ${textToSave}`);
    alert("保存しました！");
    // 1. 新しい日時を生成
    const newTimestamp = new Date().toLocaleString("ja-JP");

    // 2. lastUpdated Stateを更新
    setLastUpdated((prev) => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        [fieldId]: newTimestamp,
      },
    }));
    // ここでSupabaseへの保存処理を呼び出す
    if (user) {
      const saveLog = async () => {
        const { error } = await supabase.from("logs").insert({
          user_id: user.id,
          field_name: fieldId,
          // target_table: serviceId, // 必要であれば
        });
        if (error) console.error("Error saving log:", error);
      };
      saveLog();
    }
  };

  const handleCopyClick = (serviceId: string, fieldId: string) => {
    const textToCopy = formTexts[serviceId]?.[fieldId] || "";
    navigator.clipboard.writeText(textToCopy);
    alert("コピーしました！");
  };

  // --- レンダリングのためのデータ準備 ---
  const currentService = servicesData.find(
    (service) => service.id === activeTab
  );

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8">
      {/* --- タブナビゲーション --- */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {servicesData.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg
                ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* --- フォーム表示エリア --- */}
      <div className="mt-8">
        {activeTab !== "myES" && (
          <div className="flex justify-start mb-6">
            <button className="bg-[#1760a0] hover:scale-105 text-white font-bold py-2 px-6 rounded-lg text-base">
              一括生成
            </button>
          </div>
        )}
        {currentService && (
          <form className="space-y-8">
            {currentService.fields.map((field) => {
              const isEditing =
                editingFields[currentService.id]?.[field.id] || false;
              const currentText =
                formTexts[currentService.id]?.[field.id] || "";

              // ★ 1. Stateから最終更新日時を取得
              const updatedAtTimestamp =
                lastUpdated[currentService.id]?.[field.id];
              const lastUpdatedTime = updatedAtTimestamp
                ? new Date(updatedAtTimestamp).toLocaleString("ja-JP")
                : "未更新";

              return (
                <div key={field.id} className="relative">
                  <label className="block text-lg font-semibold text-gray-700 mb-2">
                    {field.label}
                    {field.charLimit > 0 && ` (${field.charLimit}文字以内)`}
                  </label>

                  {/* --- アイコンエリア --- */}
                  <div className="absolute top-2 right-2 flex items-center space-x-2 text-gray-400">
                    {/* ★ 2. 最終更新日時を表示 */}
                    {!isEditing && (
                      <span className="text-xs text-gray-500">
                        最終更新: {lastUpdatedTime}
                      </span>
                    )}
                    {isEditing ? (
                      <button
                        type="button"
                        onClick={() =>
                          handleSaveClick(currentService.id, field.id)
                        }
                        className="hover:text-green-500"
                      >
                        <FaSave />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          handleEditClick(currentService.id, field.id)
                        }
                        className="hover:text-blue-500"
                      >
                        <FaPencilAlt />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyClick(currentService.id, field.id)
                      }
                      className="hover:text-blue-500"
                    >
                      <FaCopy />
                    </button>
                  </div>

                  <textarea
                    rows={8}
                    className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    placeholder={field.recommended}
                    value={currentText}
                    onChange={(e) =>
                      handleTextChange(
                        currentService.id,
                        field.id,
                        e.target.value
                      )
                    }
                    disabled={!isEditing}
                  />
                </div>
              );
            })}
          </form>
        )}
      </div>
    </div>
  );
}

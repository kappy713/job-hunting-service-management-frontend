import { useState } from "react";
import { FaPencilAlt, FaCopy, FaSave } from "react-icons/fa";

// データ定義：コンポーネントの外に記述
const servicesData = [
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
        id: "gakutika_research",
        label: "ガクチカ(研究)",
        charLimit: 800,
        recommended: "200文字以上",
      },
      {
        id: "gakutika_group",
        label: "ガクチカ(所属団体)",
        charLimit: 800,
        recommended: "200文字以上",
      },
      {
        id: "gakutika_other",
        label: "ガクチカ(その他)",
        charLimit: 800,
        recommended: "200文字以上",
      },
    ],
  },
  {
    id: "one_career",
    name: "ワンキャリア",
    fields: [
      {
        id: "strength",
        label: "あなたの強み",
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
  {
    id: "career_select",
    name: "キャリアセレクト",
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

// Reactコンポーネント
export default function ESEditingPage() {
  // どのタブがアクティブかを記憶するState
  const [activeTab, setActiveTab] = useState(servicesData[0].id);
  // 全サービスの全テキスト情報を一元管理するState
  const [formTexts, setFormTexts] = useState<FormState>({});
  // どのテキストエリアが編集モードかを管理するState
  const [editingFields, setEditingFields] = useState<EditingState>({});

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
    // ここでSupabaseへの保存処理を呼び出す
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
        {currentService && (
          <form className="space-y-8">
            {currentService.fields.map((field) => {
              const isEditing =
                editingFields[currentService.id]?.[field.id] || false;
              const currentText =
                formTexts[currentService.id]?.[field.id] || "";

              return (
                <div key={field.id} className="relative">
                  <label className="block text-lg font-semibold text-gray-700 mb-2">
                    {field.label} ({field.charLimit}文字)
                  </label>

                  {/* --- アイコンエリア --- */}
                  <div className="absolute top-2 right-2 flex items-center space-x-2 text-gray-400">
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

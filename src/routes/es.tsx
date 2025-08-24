import { useState, useEffect } from "react";
import { FaPencilAlt, FaCopy, FaSave } from "react-icons/fa";
import { supabase } from "../utils/supabase"; // パスをエイリアスに変更
import type { User } from "@supabase/supabase-js";

// データ定義
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
        type: "structured_list",
        subFields: [
          {
            id: "language",
            label: "言語・技術",
            type: "select",
            options: [
              "JavaScript",
              "TypeScript",
              "Python",
              "Java",
              "Go",
              "PHP",
              "Ruby",
              "Swift",
              "Kotlin",
              "C++",
              "C#",
            ],
          },
          { id: "overview", label: "概要", charLimit: 500, type: "textarea" },
        ],
      },
      {
        id: "intern_experiences",
        label: "インターン・開発アルバイト経験",
        type: "structured_list",
        subFields: [
          {
            id: "company",
            label: "インターン・開発アルバイト先",
            type: "textarea",
          },
          { id: "content", label: "内容", charLimit: 2000, type: "textarea" },
        ],
      },
      {
        id: "products",
        label: "制作物",
        // このフィールドが特別なリスト形式であることを示すtypeプロパティを追加
        type: "structured_list",
        // 登録できる最大数を設定
        maxItems: 4,
        // 1つの制作物が持つサブフィールドを定義
        subFields: [
          { id: "overview", label: "概要", charLimit: 200, type: "textarea" },
          {
            id: "tech_stack",
            label: "技術スタック",
            charLimit: 200,
            type: "textarea",
          },
          {
            id: "description",
            label: "あなたが担当した箇所や工夫した点、受賞歴など",
            charLimit: 500,
            type: "textarea",
          },
          {
            id: "url",
            label: "GitHubリポジトリURL",
            charLimit: 0,
            type: "textarea",
          },
          {
            id: "other_url",
            label: "その他のURL",
            charLimit: 0,
            type: "textarea",
          },
        ],
      },
      {
        id: "researches",
        label: "研究",
        type: "structured_list",
        subFields: [
          { id: "theme", label: "テーマ", type: "textarea" },
          { id: "content", label: "内容", charLimit: 500, type: "textarea" },
        ],
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
type Product = {
  overview: string;
  place: string;
  tech_stack: string;
  description: string;
};

type Research = {
  theme: string;
  content: string;
};

type Internship = {
  company: string;
  period: string;
  content: string;
};

type ProgrammingSkill = {
  language: string;
  application: string;
  overview: string;
};

type FormState = {
  [serviceId: string]: {
    // ここで `any[]` を `Product[]` に置き換えます
    [fieldId: string]:
      | string
      | Product[]
      | Research[]
      | Internship[]
      | ProgrammingSkill[];
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
  const [editingSections, setEditingSections] = useState<EditingState>({});

  const [lastUpdated, setLastUpdated] = useState<LastUpdatedResponse>({});
  const [user, setUser] = useState<User | null>(null);

  // ★ 1. ユーザーが選択したサービスだけを保持するState
  const [userServices, setUserServices] = useState<typeof servicesData>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleEditSection = (serviceId: string, fieldId: string) => {
    setEditingSections((prev) => ({
      ...prev,
      [serviceId]: { ...prev[serviceId], [fieldId]: true },
    }));
  };

  const handleCopySubField = (
    serviceId: string,
    fieldId: string,
    index: number,
    subFieldId: string
  ) => {
    const list = (formTexts[serviceId]?.[fieldId] || []) as any[];
    if (list && list[index]) {
      const textToCopy = list[index][subFieldId] || "";
      navigator.clipboard.writeText(textToCopy);
      alert("コピーしました！");
    }
  };

  // 制作物リスト内のテキスト変更を処理するハンドラ
  const handleProductChange = (
    serviceId: string,
    productIndex: number,
    subFieldId: string,
    value: string
  ) => {
    const currentProducts = (formTexts[serviceId]?.products || []) as Product[];
    const newProducts = currentProducts.map((product, index) => {
      if (index === productIndex) {
        return { ...product, [subFieldId]: value };
      }
      return product;
    });
    setFormTexts((prev) => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        products: newProducts,
      },
    }));
  };

  const handleAddProduct = (serviceId: string) => {
    const newProduct = {
      overview: "",
      place: "個人開発",
      tech_stack: "",
      description: "",
      url: "",
      other_url: "",
    };
    const currentProducts = (formTexts[serviceId]?.products || []) as Product[];
    setFormTexts((prev) => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        products: [...currentProducts, newProduct],
      },
    }));
  };

  const handleRemoveProduct = (serviceId: string, productIndex: number) => {
    const currentProducts = (formTexts[serviceId]?.products || []) as Product[];
    const newProducts = currentProducts.filter(
      (_, index) => index !== productIndex
    );
    setFormTexts((prev) => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        products: newProducts,
      },
    }));
  };

  const handleSaveProducts = (serviceId: string) => {
    console.log(
      `保存する制作物データ (${serviceId}):`,
      formTexts[serviceId]?.products || []
    );
    const newTimestamp = new Date().toISOString();
    setLastUpdated((prev) => ({
      ...prev,
      [serviceId]: { ...prev[serviceId], products: newTimestamp },
    }));
    setEditingSections((prev) => ({
      ...prev,
      [serviceId]: { ...prev[serviceId], products: false },
    }));
    alert("制作物を保存しました！");
  };

  const handleResearchChange = (
    serviceId: string,
    researchIndex: number,
    subFieldId: string,
    value: string
  ) => {
    const currentResearches = (formTexts[serviceId]?.researches ||
      []) as Research[];
    const newResearches = currentResearches.map((research, index) => {
      if (index === researchIndex) {
        return { ...research, [subFieldId]: value };
      }
      return research;
    });
    setFormTexts((prev) => ({
      ...prev,
      [serviceId]: { ...prev[serviceId], researches: newResearches },
    }));
  };

  const handleAddResearch = (serviceId: string) => {
    const newResearch: Research = { theme: "", content: "" };
    const currentResearches = (formTexts[serviceId]?.researches ||
      []) as Research[];
    setFormTexts((prev) => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        researches: [...currentResearches, newResearch],
      },
    }));
  };

  const handleRemoveResearch = (serviceId: string, researchIndex: number) => {
    const currentResearches = (formTexts[serviceId]?.researches ||
      []) as Research[];
    const newResearches = currentResearches.filter(
      (_, index) => index !== researchIndex
    );
    setFormTexts((prev) => ({
      ...prev,
      [serviceId]: { ...prev[serviceId], researches: newResearches },
    }));
  };

  const handleSaveResearches = (serviceId: string) => {
    console.log(
      `保存する研究データ (${serviceId}):`,
      formTexts[serviceId]?.researches || []
    );
    const newTimestamp = new Date().toISOString();
    setLastUpdated((prev) => ({
      ...prev,
      [serviceId]: { ...prev[serviceId], researches: newTimestamp },
    }));
    setEditingSections((prev) => ({
      ...prev,
      [serviceId]: { ...prev[serviceId], researches: false },
    }));
    alert("研究内容を保存しました！");
  };

  const handleInternshipChange = (
    serviceId: string,
    internshipIndex: number,
    subFieldId: string,
    value: string
  ) => {
    const currentInternships = (formTexts[serviceId]?.intern_experiences ||
      []) as Internship[];
    const newInternships = currentInternships.map((internship, index) => {
      if (index === internshipIndex) {
        return { ...internship, [subFieldId]: value };
      }
      return internship;
    });
    setFormTexts((prev) => ({
      ...prev,
      [serviceId]: { ...prev[serviceId], intern_experiences: newInternships },
    }));
  };

  const handleAddInternship = (serviceId: string) => {
    const newInternship: Internship = {
      company: "",
      period: "1ヶ月",
      content: "",
    };
    const currentInternships = (formTexts[serviceId]?.intern_experiences ||
      []) as Internship[];
    setFormTexts((prev) => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        intern_experiences: [...currentInternships, newInternship],
      },
    }));
  };

  const handleRemoveInternship = (
    serviceId: string,
    internshipIndex: number
  ) => {
    const currentInternships = (formTexts[serviceId]?.intern_experiences ||
      []) as Internship[];
    const newInternships = currentInternships.filter(
      (_, index) => index !== internshipIndex
    );
    setFormTexts((prev) => ({
      ...prev,
      [serviceId]: { ...prev[serviceId], intern_experiences: newInternships },
    }));
  };

  const handleSaveInternships = (serviceId: string) => {
    console.log(
      `保存するインターン経験データ (${serviceId}):`,
      formTexts[serviceId]?.intern_experiences || []
    );
    const newTimestamp = new Date().toISOString();
    setLastUpdated((prev) => ({
      ...prev,
      [serviceId]: { ...prev[serviceId], intern_experiences: newTimestamp },
    }));
    setEditingSections((prev) => ({
      ...prev,
      [serviceId]: { ...prev[serviceId], intern_experiences: false },
    }));
    alert("インターン経験を保存しました！");
  };

  // スキルリスト内のテキスト変更を処理するハンドラ
  const handleSkillChange = (
    serviceId: string,
    skillIndex: number,
    subFieldId: string,
    value: string
  ) => {
    const currentSkills = (formTexts[serviceId]?.skills ||
      []) as ProgrammingSkill[];
    const newSkills = currentSkills.map((skill, index) => {
      if (index === skillIndex) {
        return { ...skill, [subFieldId]: value };
      }
      return skill;
    });
    setFormTexts((prev) => ({
      ...prev,
      [serviceId]: { ...prev[serviceId], skills: newSkills },
    }));
  };

  const handleAddSkill = (serviceId: string) => {
    const newSkill: ProgrammingSkill = {
      language: "JavaScript",
      application: "Webフロントエンド",
      overview: "",
    };
    const currentSkills = (formTexts[serviceId]?.skills ||
      []) as ProgrammingSkill[];
    setFormTexts((prev) => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        skills: [...currentSkills, newSkill],
      },
    }));
  };

  const handleRemoveSkill = (serviceId: string, skillIndex: number) => {
    const currentSkills = (formTexts[serviceId]?.skills ||
      []) as ProgrammingSkill[];
    const newSkills = currentSkills.filter((_, index) => index !== skillIndex);
    setFormTexts((prev) => ({
      ...prev,
      [serviceId]: { ...prev[serviceId], skills: newSkills },
    }));
  };

  const handleSaveSkills = (serviceId: string) => {
    console.log(
      `保存するスキルデータ (${serviceId}):`,
      formTexts[serviceId]?.skills || []
    );
    const newTimestamp = new Date().toISOString();
    setLastUpdated((prev) => ({
      ...prev,
      [serviceId]: { ...prev[serviceId], skills: newTimestamp },
    }));
    setEditingSections((prev) => ({
      ...prev,
      [serviceId]: { ...prev[serviceId], skills: false },
    }));
    alert("プログラミングスキルを保存しました！");
  };

  // ユーザー情報の取得と、最終更新日時を取得
  useEffect(() => {
    // デモ用に、表示したいサービスのIDを配列として定義。消す！！！！
    const demoSelectedServiceIds = [
      "supporters",
      "levtech_rookie",
      "one_career",
    ];
    const filteredServices = servicesData.filter((service) =>
      demoSelectedServiceIds.includes(service.id)
    );
    setUserServices(filteredServices);
    if (filteredServices.length > 0) {
      setActiveTab(filteredServices[0].id);
    }
    setIsLoading(false);

    //以下、バックエンドと繋げたらコメントアウト解除!!!!!!!!!
    /*async function fetchData() {
      // 1. 現在のログインユーザー情報を取得
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // 2. ユーザーが選択したサービスを取得
        const { data, error } = await supabase
          .from("users") // あなたのプロフィールテーブル名
          .select("services") // サービスが保存されているカラム名
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          setIsLoading(false);
          return;
        }

        if (data && data.services) {
          const selectedServiceNames = data.services;

          // ★ 3. 全サービスリストから、ユーザーが選択したものだけを名前でフィルタリング
          const filteredServices = servicesData.filter(
            (service) => selectedServiceNames.includes(service.name) // `id`ではなく`name`で照合
          );
          setUserServices(filteredServices);
          if (filteredServices.length > 0) {
            setActiveTab(filteredServices[0].id);
          }
        }

        // 3. 最終更新日時のログを取得（API呼び出し）
        // あなたのバックエンドAPIのエンドポイントをここに設定します
        // const response = await fetch('/api/get-logs');
        // const logsData: LastUpdatedResponse = await response.json();

        // 今回はダミーデータをそのまま使います
        const logsData: LastUpdatedResponse = {
          mynavi: { self_promotion: "2025-08-23T10:30:00+09:00" },
          levtech_rookie: { desired_job_type: "2025-08-22T14:00:00+09:00" },
        };
        setLastUpdated(logsData);
      }
      setIsLoading(false); // 全てのデータ取得が終わったらローディングを解除
    }

    fetchData();*/
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
          id: crypto.randomUUID(),
          user_id: user.id,
          field_name: fieldId,
          target_table: serviceId,
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

  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  if (userServices.length === 0) {
    return (
      <div>
        表示する就活サービスがありません。サービス選択ページで登録してください。
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8">
      {/* --- タブナビゲーション --- */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {/* --- マイエントリーシートタブを常に表示 --- */}
          <button
            key="myES"
            onClick={() => setActiveTab("myES")}
            className={`
      whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg
      ${
        activeTab === "myES"
          ? "border-blue-500 text-blue-600"
          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
      }
    `}
          >
            マイエントリーシート
          </button>

          {/* --- ユーザーが選択した他のサービスを表示 --- */}
          {userServices
            .filter((tab) => tab.id !== "myES") // myESを除外して重複を防ぐ
            .map((tab) => (
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
        {activeTab == "myES" && (
          <div className="flex justify-start mb-6">
            <button className="bg-[#1760a0] hover:scale-105 text-white font-bold py-2 px-6 rounded-lg text-base">
              一括生成
            </button>
          </div>
        )}
        {currentService && (
          <form className="space-y-8">
            {currentService.fields.map((field) => {
              // ===========================================
              // ▼▼▼ 'skills' の場合のJSXを追加 ▼▼▼
              // ===========================================
              if (field.type === "structured_list" && field.id === "skills") {
                const isEditing =
                  editingSections[currentService.id]?.[field.id] || false;
                const skills = (formTexts[currentService.id]?.[field.id] ||
                  []) as ProgrammingSkill[];
                const updatedAtTimestamp =
                  lastUpdated[currentService.id]?.[field.id];
                const lastUpdatedTime = updatedAtTimestamp
                  ? new Date(updatedAtTimestamp).toLocaleString("ja-JP")
                  : "未更新";

                return (
                  <div key={field.id} className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="block text-lg font-semibold text-gray-700">
                        {field.label}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          最終更新: {lastUpdatedTime}
                        </span>
                        {isEditing ? (
                          <button
                            type="button"
                            onClick={() => handleSaveSkills(currentService.id)}
                            className="text-gray-500 hover:text-green-500"
                          >
                            <FaSave />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              handleEditSection(currentService.id, field.id)
                            }
                            className="text-gray-500 hover:text-blue-500"
                          >
                            <FaPencilAlt />
                          </button>
                        )}
                      </div>
                    </div>
                    {isEditing ? (
                      <div>
                        <div className="space-y-6">
                          {skills.map((skill, index) => (
                            <div
                              key={index}
                              className="border rounded-lg p-4 relative bg-gray-50"
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveSkill(currentService.id, index)
                                }
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold"
                              >
                                削除
                              </button>
                              {field.subFields?.map((subField) => (
                                <div key={subField.id} className="mb-4">
                                  <div className="flex justify-between items-center mb-1">
                                    <label className="block text-md font-medium text-gray-600">
                                      {subField.label}
                                    </label>
                                    {subField.id === "overview" && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleCopySubField(
                                            currentService.id,
                                            field.id,
                                            index,
                                            subField.id
                                          )
                                        }
                                        className="text-gray-400 hover:text-blue-500"
                                      >
                                        <FaCopy />
                                      </button>
                                    )}
                                  </div>
                                  {subField.type === "select" ? (
                                    <select
                                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                      value={
                                        skill[
                                          subField.id as keyof ProgrammingSkill
                                        ] || ""
                                      }
                                      onChange={(e) =>
                                        handleSkillChange(
                                          currentService.id,
                                          index,
                                          subField.id,
                                          e.target.value
                                        )
                                      }
                                    >
                                      {subField.options?.map((option) => (
                                        <option key={option} value={option}>
                                          {option}
                                        </option>
                                      ))}
                                    </select>
                                  ) : (
                                    <textarea
                                      rows={5}
                                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                      placeholder="(例) HTML5とJavaScriptを用いてWebブラウザゲームを作成したことがある。"
                                      value={
                                        skill[
                                          subField.id as keyof ProgrammingSkill
                                        ] || ""
                                      }
                                      onChange={(e) =>
                                        handleSkillChange(
                                          currentService.id,
                                          index,
                                          subField.id,
                                          e.target.value
                                        )
                                      }
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                        <div className="mt-4">
                          <button
                            type="button"
                            onClick={() => handleAddSkill(currentService.id)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                          >
                            + スキルを追加
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {skills.map((skill, index) => (
                          <div
                            key={index}
                            className="p-4 rounded-md bg-gray-100"
                          >
                            <dl>
                              {field.subFields?.map((subField) => (
                                <div key={subField.id} className="mb-2">
                                  <dt className="font-semibold text-sm text-gray-600">
                                    {subField.label}
                                  </dt>
                                  <dd className="text-gray-800 whitespace-pre-wrap">
                                    {
                                      skill[
                                        subField.id as keyof ProgrammingSkill
                                      ]
                                    }
                                  </dd>
                                </div>
                              ))}
                            </dl>
                          </div>
                        ))}
                        {skills.length === 0 && (
                          <p className="text-gray-500">登録されていません。</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              }

              // =======================================================
              // ▼▼▼ 'intern_experiences' の場合のJSXを追加 ▼▼▼
              // =======================================================
              if (
                field.type === "structured_list" &&
                field.id === "intern_experiences"
              ) {
                const isEditing =
                  editingSections[currentService.id]?.[field.id] || false;
                const internships = (formTexts[currentService.id]?.[field.id] ||
                  []) as Internship[];
                const updatedAtTimestamp =
                  lastUpdated[currentService.id]?.[field.id];
                const lastUpdatedTime = updatedAtTimestamp
                  ? new Date(updatedAtTimestamp).toLocaleString("ja-JP")
                  : "未更新";

                return (
                  <div key={field.id} className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="block text-lg font-semibold text-gray-700">
                        {field.label}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          最終更新: {lastUpdatedTime}
                        </span>
                        {isEditing ? (
                          <button
                            type="button"
                            onClick={() =>
                              handleSaveInternships(currentService.id)
                            }
                            className="text-gray-500 hover:text-green-500"
                          >
                            <FaSave />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              handleEditSection(currentService.id, field.id)
                            }
                            className="text-gray-500 hover:text-blue-500"
                          >
                            <FaPencilAlt />
                          </button>
                        )}
                      </div>
                    </div>
                    {isEditing ? (
                      <div>
                        <div className="space-y-6">
                          {internships.map((internship, index) => (
                            <div
                              key={index}
                              className="border rounded-lg p-4 relative bg-gray-50"
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveInternship(
                                    currentService.id,
                                    index
                                  )
                                }
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold"
                              >
                                削除
                              </button>
                              {field.subFields?.map((subField) => (
                                <div key={subField.id} className="mb-4">
                                  <div className="flex justify-between items-center mb-1">
                                    <label className="block text-md font-medium text-gray-600">
                                      {subField.label}
                                    </label>
                                    {subField.id === "content" && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleCopySubField(
                                            currentService.id,
                                            field.id,
                                            index,
                                            subField.id
                                          )
                                        }
                                        className="text-gray-400 hover:text-blue-500"
                                      >
                                        <FaCopy />
                                      </button>
                                    )}
                                  </div>
                                  {subField.type === "select" ? (
                                    <select
                                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                      value={
                                        internship[
                                          subField.id as keyof Internship
                                        ] || ""
                                      }
                                      onChange={(e) =>
                                        handleInternshipChange(
                                          currentService.id,
                                          index,
                                          subField.id,
                                          e.target.value
                                        )
                                      }
                                    >
                                      {subField.options?.map((option) => (
                                        <option key={option} value={option}>
                                          {option}
                                        </option>
                                      ))}
                                    </select>
                                  ) : (
                                    <textarea
                                      rows={subField.id === "content" ? 8 : 1}
                                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                      placeholder={
                                        subField.id === "company"
                                          ? "(例) 株式会社サポーターズ"
                                          : ""
                                      }
                                      value={
                                        internship[
                                          subField.id as keyof Internship
                                        ] || ""
                                      }
                                      onChange={(e) =>
                                        handleInternshipChange(
                                          currentService.id,
                                          index,
                                          subField.id,
                                          e.target.value
                                        )
                                      }
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                        <div className="mt-4">
                          <button
                            type="button"
                            onClick={() =>
                              handleAddInternship(currentService.id)
                            }
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                          >
                            + インターン経験を追加
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {internships.map((internship, index) => (
                          <div
                            key={index}
                            className="p-4 rounded-md bg-gray-100"
                          >
                            <dl>
                              {field.subFields?.map((subField) => (
                                <div key={subField.id} className="mb-2">
                                  <dt className="font-semibold text-sm text-gray-600">
                                    {subField.label}
                                  </dt>
                                  <dd className="text-gray-800 whitespace-pre-wrap">
                                    {
                                      internship[
                                        subField.id as keyof Internship
                                      ]
                                    }
                                  </dd>
                                </div>
                              ))}
                            </dl>
                          </div>
                        ))}
                        {internships.length === 0 && (
                          <p className="text-gray-500">登録されていません。</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              }
              if (field.type === "structured_list") {
                // =================================================
                // ▼▼▼ field.id が 'researches' の場合のJSXを追加 ▼▼▼
                // =================================================
                if (
                  field.type === "structured_list" &&
                  field.id === "researches"
                ) {
                  const isEditing =
                    editingSections[currentService.id]?.[field.id] || false;
                  const researches = (formTexts[currentService.id]?.[
                    field.id
                  ] || []) as Research[];
                  const updatedAtTimestamp =
                    lastUpdated[currentService.id]?.[field.id];
                  const lastUpdatedTime = updatedAtTimestamp
                    ? new Date(updatedAtTimestamp).toLocaleString("ja-JP")
                    : "未更新";

                  return (
                    <div key={field.id} className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="block text-lg font-semibold text-gray-700">
                          {field.label}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            最終更新: {lastUpdatedTime}
                          </span>
                          {isEditing ? (
                            <button
                              type="button"
                              onClick={() =>
                                handleSaveResearches(currentService.id)
                              }
                              className="text-gray-500 hover:text-green-500"
                            >
                              <FaSave />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                handleEditSection(currentService.id, field.id)
                              }
                              className="text-gray-500 hover:text-blue-500"
                            >
                              <FaPencilAlt />
                            </button>
                          )}
                        </div>
                      </div>
                      {isEditing ? (
                        <div>
                          <div className="space-y-6">
                            {researches.map((research, index) => (
                              <div
                                key={index}
                                className="border rounded-lg p-4 relative bg-gray-50"
                              >
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveResearch(
                                      currentService.id,
                                      index
                                    )
                                  }
                                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold"
                                >
                                  削除
                                </button>
                                {field.subFields?.map((subField) => (
                                  <div key={subField.id} className="mb-4">
                                    <div className="flex justify-between items-center mb-1">
                                      <label className="block text-md font-medium text-gray-600">
                                        {subField.label}
                                        {subField.charLimit > 0 &&
                                          ` (最大${subField.charLimit}文字)`}
                                      </label>
                                      {subField.id === "content" && (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleCopySubField(
                                              currentService.id,
                                              field.id,
                                              index,
                                              subField.id
                                            )
                                          }
                                          className="text-gray-400 hover:text-blue-500"
                                        >
                                          <FaCopy />
                                        </button>
                                      )}
                                    </div>
                                    <textarea
                                      rows={subField.id === "content" ? 8 : 2}
                                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                      placeholder={`${subField.label}を入力してください`}
                                      value={
                                        research[
                                          subField.id as keyof Research
                                        ] || ""
                                      }
                                      onChange={(e) =>
                                        handleResearchChange(
                                          currentService.id,
                                          index,
                                          subField.id,
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                          <div className="mt-4">
                            <button
                              type="button"
                              onClick={() =>
                                handleAddResearch(currentService.id)
                              }
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                            >
                              + 研究を追加
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {researches.map((research, index) => (
                            <div
                              key={index}
                              className="p-4 rounded-md bg-gray-100"
                            >
                              <dl>
                                {field.subFields?.map((subField) => (
                                  <div key={subField.id} className="mb-2">
                                    <dt className="font-semibold text-sm text-gray-600">
                                      {subField.label}
                                    </dt>
                                    <dd className="text-gray-800 whitespace-pre-wrap">
                                      {research[subField.id as keyof Research]}
                                    </dd>
                                  </div>
                                ))}
                              </dl>
                            </div>
                          ))}
                          {researches.length === 0 && (
                            <p className="text-gray-500">
                              登録されていません。
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                }

                // =================================================
                // ▼▼▼ field.id が 'products' の場合のJSXを追加 ▼▼▼
                // =================================================
                if (
                  field.type === "structured_list" &&
                  field.id === "products"
                ) {
                  const isEditing =
                    editingSections[currentService.id]?.[field.id] || false;
                  const products = (formTexts[currentService.id]?.[field.id] ||
                    []) as Product[];
                  const updatedAtTimestamp =
                    lastUpdated[currentService.id]?.[field.id];
                  const lastUpdatedTime = updatedAtTimestamp
                    ? new Date(updatedAtTimestamp).toLocaleString("ja-JP")
                    : "未更新";

                  return (
                    <div key={field.id} className="border-t pt-4">
                      {/* ヘッダー部分：タイトル、最終更新日時、編集/保存ボタン */}
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="block text-lg font-semibold text-gray-700">
                          {field.label}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            最終更新: {lastUpdatedTime}
                          </span>
                          {isEditing ? (
                            <button
                              type="button"
                              onClick={() =>
                                handleSaveProducts(currentService.id)
                              }
                              className="text-gray-500 hover:text-green-500"
                            >
                              <FaSave />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                handleEditSection(currentService.id, field.id)
                              }
                              className="text-gray-500 hover:text-blue-500"
                            >
                              <FaPencilAlt />
                            </button>
                          )}
                        </div>
                      </div>

                      {isEditing ? (
                        // 編集モードのUI：入力可能なフォーム要素を表示
                        <div>
                          <p className="text-sm text-gray-500 mb-4">
                            制作物は{field.maxItems}つまで登録できます
                          </p>
                          <div className="space-y-6">
                            {products.map((product, index) => (
                              <div
                                key={index}
                                className="border rounded-lg p-4 relative bg-gray-50"
                              >
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveProduct(
                                      currentService.id,
                                      index
                                    )
                                  }
                                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold"
                                >
                                  削除
                                </button>
                                {field.subFields?.map((subField) => (
                                  <div key={subField.id} className="mb-4">
                                    <div className="flex justify-between items-center mb-1">
                                      <label className="block text-md font-medium text-gray-600">
                                        {subField.label}
                                      </label>
                                      {/* 「担当した箇所」にのみコピーボタンを表示 */}
                                      {subField.id === "description" && (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleCopySubField(
                                              currentService.id,
                                              field.id,
                                              index,
                                              subField.id
                                            )
                                          }
                                          className="text-gray-400 hover:text-blue-500"
                                        >
                                          <FaCopy />
                                        </button>
                                      )}
                                    </div>
                                    {subField.type === "textarea" ? (
                                      <textarea
                                        rows={
                                          subField.id === "description" ? 5 : 3
                                        }
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                        value={
                                          product[
                                            subField.id as keyof Product
                                          ] || ""
                                        }
                                        onChange={(e) =>
                                          handleProductChange(
                                            currentService.id,
                                            index,
                                            subField.id,
                                            e.target.value
                                          )
                                        }
                                      />
                                    ) : (
                                      <select
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                        value={
                                          product[
                                            subField.id as keyof Product
                                          ] || ""
                                        }
                                        onChange={(e) =>
                                          handleProductChange(
                                            currentService.id,
                                            index,
                                            subField.id,
                                            e.target.value
                                          )
                                        }
                                      >
                                        {subField.options?.map((option) => (
                                          <option key={option} value={option}>
                                            {option}
                                          </option>
                                        ))}
                                      </select>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                          {products.length < (field.maxItems || 0) && (
                            <div className="mt-4">
                              <button
                                type="button"
                                onClick={() =>
                                  handleAddProduct(currentService.id)
                                }
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                              >
                                + 制作物を追加
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        // 表示モードのUI：読み取り専用のテキストを表示
                        <div className="space-y-4">
                          {products.map((product, index) => (
                            <div
                              key={index}
                              className="p-4 rounded-md bg-gray-100"
                            >
                              <dl>
                                {field.subFields?.map((subField) => (
                                  <div key={subField.id} className="mb-2">
                                    <dt className="font-semibold text-sm text-gray-600">
                                      {subField.label}
                                    </dt>
                                    <dd className="text-gray-800 whitespace-pre-wrap">
                                      {product[subField.id as keyof Product]}
                                    </dd>
                                  </div>
                                ))}
                              </dl>
                            </div>
                          ))}
                          {products.length === 0 && (
                            <p className="text-gray-500">
                              登録されていません。
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                }
              }

              // 通常のテキストエリアをレンダリング（既存のコード）
              const isEditing =
                editingFields[currentService.id]?.[field.id] || false;
              const currentText = (formTexts[currentService.id]?.[field.id] ||
                "") as string;
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

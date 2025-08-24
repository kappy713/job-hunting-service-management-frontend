import { useState, useEffect } from "react";
import { FaPencilAlt, FaCopy, FaSave } from "react-icons/fa";
import { supabase } from "../utils/supabase"; // パスをエイリアスに変更
import type { User } from "@supabase/supabase-js";
import { API_CONFIG } from "../api/config";
import { PulseLoader } from "react-spinners";

// 日時フォーマット関数
const formatDateTime = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    return date.toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "未更新";
  }
};

// サービスIDとAPIログキーのマッピング
const SERVICE_TO_LOG_KEY: { [key: string]: string } = {
  myES: "profiles",
  supporters: "supporterz", 
  career_select: "career_select",
};

// データ定義
const servicesData = [
  {
    id: "myES",
    name: "マイエントリーシート",
    fields: [
      {
        id: "career_vision",
        label: "キャリアビジョン",
        charLimit: 400,
        recommended: "",
      },
      {
        id: "self_promotion",
        label: "自己PR",
        charLimit: 400,
        recommended: "",
      },
      {
        id: "gakuchika",
        label: "ガクチカ（学生時代に頑張ったこと）",
        charLimit: 400,
        recommended: "",
      },
      {
        id: "research",
        label: "研究内容",
        charLimit: 500,
        recommended: "",
      },
      {
        id: "activities",
        label: "部活・サークル・団体活動経験",
        charLimit: 400,
        recommended: "",
      },
      {
        id: "desired_roles_text",
        label: "希望職種",
        charLimit: 200,
        recommended: "",
      },
      {
        id: "company_axes_text",
        label: "企業選びの軸",
        charLimit: 300,
        recommended: "",
      },
      {
        id: "ideal_engineer",
        label: "理想のエンジニア像",
        charLimit: 400,
        recommended: "",
      },
      {
        id: "skills",
        label: "スキル",
        type: "structured_list",
        maxItems: 10,
        subFields: [
          { id: "name", label: "スキル名", charLimit: 100, type: "textarea" },
          { id: "description", label: "スキルの説明", charLimit: 500, type: "textarea" },
        ],
      },
      {
        id: "works",
        label: "制作物・開発経験",
        type: "structured_list",
        maxItems: 5,
        subFields: [
          { id: "name", label: "制作物名", charLimit: 100, type: "textarea" },
          { id: "description", label: "制作物の説明", charLimit: 500, type: "textarea" },
        ],
      },
      {
        id: "experiences",
        label: "経験（インターン・アルバイト・活動）",
        type: "structured_list",
        maxItems: 5,
        subFields: [
          { id: "name", label: "経験名", charLimit: 100, type: "textarea" },
          { id: "description", label: "経験の説明", charLimit: 500, type: "textarea" },
        ],
      },
      {
        id: "certifications",
        label: "資格",
        type: "structured_list",
        maxItems: 10,
        subFields: [
          { id: "name", label: "資格名", charLimit: 100, type: "textarea" },
          { id: "description", label: "資格の説明", charLimit: 500, type: "textarea" },
        ],
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
        charLimit: 200,
        recommended: "",
      },
      {
        id: "career_aspiration",
        label: "どのようなエンジニアになりたいですか？",
        charLimit: 400,
        recommended: "",
      },
      {
        id: "interested_tasks",
        label: "どのような業務に関心がありますか？",
        charLimit: 300,
        recommended: "",
      },
      {
        id: "job_requirements",
        label: "就職先に求めること",
        charLimit: 300,
        recommended: "",
      },
      {
        id: "interested_industries",
        label: "興味のある業界",
        charLimit: 200,
        recommended: "",
      },
      {
        id: "preferred_company_size",
        label: "希望企業規模",
        charLimit: 100,
        recommended: "",
      },
      {
        id: "interested_business_types",
        label: "興味のある業態",
        charLimit: 200,
        recommended: "",
      },
      {
        id: "preferred_work_location",
        label: "希望勤務地",
        charLimit: 100,
        recommended: "",
      },
      {
        id: "skills",
        label: "プログラミング言語",
        charLimit: 300,
        recommended: "",
      },
      {
        id: "skill_descriptions",
        label: "経験",
        charLimit: 500,
        recommended: "",
      },
      {
        id: "portfolio",
        label: "ポートフォリオURL",
        charLimit: 200,
        recommended: "",
      },
      {
        id: "portfolio_description",
        label: "ポートフォリオの説明",
        charLimit: 400,
        recommended: "200文字以上推奨",
      },
      {
        id: "intern_experiences",
        label: "インターン経験",
        charLimit: 300,
        recommended: "",
      },
      {
        id: "intern_experience_descriptions",
        label: "取り組んだこと",
        charLimit: 400,
        recommended: "200文字以上推奨",
      },
      {
        id: "hackathon_experiences",
        label: "ハッカソン経験",
        charLimit: 300,
        recommended: "",
      },
      {
        id: "hackathon_experience_descriptions",
        label: "取り組んだこと",
        charLimit: 400,
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
        charLimit: 300,
        recommended: "",
      },
      {
        id: "languages",
        label: "言語",
        charLimit: 200,
        recommended: "",
      },
      {
        id: "language_levels",
        label: "言語スキルレベル",
        charLimit: 200,
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
        charLimit: 400,
        recommended: "",
      },
      {
        id: "intern_experiences",
        label: "インターン実績",
        charLimit: 400,
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
            charLimit: 200,
            type: "textarea",
          },
          {
            id: "other_url",
            label: "その他のURL",
            charLimit: 200,
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
        charLimit: 300,
        recommended: "",
      },
      {
        id: "skill_description",
        label: "用途",
        charLimit: 200,
        recommended: "",
      },
      {
        id: "career_vision",
        label: "キャリアビジョン",
        charLimit: 400,
        recommended: "",
      },
      {
        id: "self_promotion",
        label: "自己PR",
        charLimit: 400,
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
        charLimit: 400,
        recommended: "",
      },
      {
        id: "experiences",
        label: "これまでの経験",
        charLimit: 400,
        recommended: "",
      },
      {
        id: "intern_experiences",
        label: "インターン・アルバイト",
        charLimit: 400,
        recommended: "",
      },
      {
        id: "certifications",
        label: "資格",
        charLimit: 300,
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

type SimpleItem = {
  name: string;
  description: string;
};

type FormState = {
  [serviceId: string]: {
    // ここで `any[]` を `Product[]` に置き換えます
    [fieldId: string]:
      | string
      | Product[]
      | Research[]
      | Internship[]
      | ProgrammingSkill[]
      | SimpleItem[];
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

  //supabase保存可能になればsetUserつきのほうにする
  const [user, setUser] = useState<User | null>(null);

  // ★ 1. ユーザーが選択したサービスだけを保持するState
  const [userServices, setUserServices] = useState<typeof servicesData>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

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
    const fieldData = formTexts[serviceId]?.[fieldId];
    if (Array.isArray(fieldData) && fieldData[index]) {
      const item = fieldData[index];
      const textToCopy = item[subFieldId as keyof typeof item] || "";
      navigator.clipboard.writeText(textToCopy);
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

  // AI一括生成関数
  const handleBatchGenerate = async () => {
    if (!user?.id) {
      alert("ユーザー情報が取得できません。再度ログインしてください。");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AI_GENERATE_PROFILES}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          services: ["supporterz", "career_select", "one_career", "mynavi", "levtech_rookie"]
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('AI生成結果:', result);
      
      if (result.status === 'success') {
        // ページをリロードして最新データを取得
        window.location.reload();
      } else {
        console.error('AI生成エラー:', result.message || 'Unknown error');
      }
    } catch (error) {
      console.error('AI生成エラー:', error);
    } finally {
      setIsGenerating(false);
    }
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
    const logKey = SERVICE_TO_LOG_KEY[serviceId] || serviceId;
    setLastUpdated((prev) => ({
      ...prev,
      [logKey]: { ...prev[logKey], products: newTimestamp },
    }));
    setEditingSections((prev) => ({
      ...prev,
      [serviceId]: { ...prev[serviceId], products: false },
    }));
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
    const logKey = SERVICE_TO_LOG_KEY[serviceId] || serviceId;
    setLastUpdated((prev) => ({
      ...prev,
      [logKey]: { ...prev[logKey], researches: newTimestamp },
    }));
    setEditingSections((prev) => ({
      ...prev,
      [serviceId]: { ...prev[serviceId], researches: false },
    }));
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
    const logKey = SERVICE_TO_LOG_KEY[serviceId] || serviceId;
    setLastUpdated((prev) => ({
      ...prev,
      [logKey]: { ...prev[logKey], intern_experiences: newTimestamp },
    }));
    setEditingSections((prev) => ({
      ...prev,
      [serviceId]: { ...prev[serviceId], intern_experiences: false },
    }));
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
    const logKey = SERVICE_TO_LOG_KEY[serviceId] || serviceId;
    setLastUpdated((prev) => ({
      ...prev,
      [logKey]: { ...prev[logKey], skills: newTimestamp },
    }));
    setEditingSections((prev) => ({
      ...prev,
      [serviceId]: { ...prev[serviceId], skills: false },
    }));
  };

  // Simple Item用のハンドラー関数
  const handleSimpleItemChange = (
    serviceId: string,
    fieldId: string,
    itemIndex: number,
    subFieldId: string,
    value: string
  ) => {
    const currentItems = (formTexts[serviceId]?.[fieldId] || []) as SimpleItem[];
    const newItems = currentItems.map((item, index) => {
      if (index === itemIndex) {
        return { ...item, [subFieldId]: value };
      }
      return item;
    });
    setFormTexts((prev) => ({
      ...prev,
      [serviceId]: { ...prev[serviceId], [fieldId]: newItems },
    }));
  };

  const handleAddSimpleItem = (serviceId: string, fieldId: string) => {
    const newItem: SimpleItem = { name: "", description: "" };
    const currentItems = (formTexts[serviceId]?.[fieldId] || []) as SimpleItem[];
    setFormTexts((prev) => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        [fieldId]: [...currentItems, newItem],
      },
    }));
  };

  const handleRemoveSimpleItem = (serviceId: string, fieldId: string, itemIndex: number) => {
    const currentItems = (formTexts[serviceId]?.[fieldId] || []) as SimpleItem[];
    const newItems = currentItems.filter((_, index) => index !== itemIndex);
    setFormTexts((prev) => ({
      ...prev,
      [serviceId]: { ...prev[serviceId], [fieldId]: newItems },
    }));
  };

  const handleSaveSimpleItems = (serviceId: string, fieldId: string, fieldLabel: string) => {
    console.log(
      `保存する${fieldLabel}データ (${serviceId}):`,
      formTexts[serviceId]?.[fieldId] || []
    );
    const newTimestamp = new Date().toISOString();
    const logKey = SERVICE_TO_LOG_KEY[serviceId] || serviceId;
    setLastUpdated((prev) => ({
      ...prev,
      [logKey]: { ...prev[logKey], [fieldId]: newTimestamp },
    }));
    setEditingSections((prev) => ({
      ...prev,
      [serviceId]: { ...prev[serviceId], [fieldId]: false },
    }));
  };

  // ユーザー情報の取得と、最終更新日時を取得
  useEffect(() => {
    async function fetchData() {
      // 1. 現在のログインユーザー情報を取得
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        try {
          // 実際のAPIからデータを取得
          // const testUserId = 'b867c4ed-e2c5-46eb-a50d-35c62a1e22a2'; // 固定UUID（後で使うかもしれないのでコメントアウト）
          const userId = user.id;
          const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_SERVICE_DETAILS(userId)}`);
          
          if (response.ok) {
            const serviceData = await response.json();
            console.log('API service data:', serviceData);
            
            // 3. サービス情報とデータを使用してUIを更新
            if (serviceData.services && serviceData.services.length > 0) {
              // サービス名のマッピング（APIのサービス名 → servicesDataのname）
              const serviceNameMapping: { [key: string]: string } = {
                'サポーターズ': 'サポーターズ',
                'キャリアセレクト': 'キャリアセレクト',
              };
              
              // ユーザーが選択したサービスをフィルタリング
              const filteredServices = servicesData.filter((service) => {
                return serviceData.services.some((apiServiceName: string) => 
                  serviceNameMapping[apiServiceName] === service.name
                );
              });
              
              // マイエントリーシートを常に先頭に追加
              const myESService = servicesData.find(service => service.id === "myES");
              const finalServices = myESService 
                ? [myESService, ...filteredServices.filter(service => service.id !== "myES")]
                : filteredServices;
                
              setUserServices(finalServices);
              if (finalServices.length > 0) {
                setActiveTab(finalServices[0].id);
              }

              // 4. 取得したAPIデータをformTextsに設定
              const initialFormData: FormState = {};
              
              // キャリアセレクトのデータを設定
              if (serviceData.data.career_select) {
                const careerSelectData = serviceData.data.career_select;
                initialFormData['career_select'] = {
                  career_vision: careerSelectData.career_vision || '',
                  self_promotion: careerSelectData.self_promotion || '',
                  skills: careerSelectData.skills || [],
                  skill_descriptions: careerSelectData.skill_descriptions || [],
                  company_selection_criteria: careerSelectData.company_selection_criteria || [],
                  company_selection_criteria_descriptions: careerSelectData.company_selection_criteria_descriptions || [],
                  research: careerSelectData.research || '',
                  products: careerSelectData.products || [],
                  product_descriptions: careerSelectData.product_descriptions || [],
                  experiences: careerSelectData.experiences || [],
                  experience_descriptions: careerSelectData.experience_descriptions || [],
                  intern_experiences: careerSelectData.intern_experiences || [],
                  intern_experience_descriptions: careerSelectData.intern_experience_descriptions || [],
                  certifications: careerSelectData.certifications || [],
                  certification_descriptions: careerSelectData.certification_descriptions || [],
                };
              }

              // サポーターズのデータを設定
              if (serviceData.data.supporterz) {
                const supporterzData = serviceData.data.supporterz;
                initialFormData['supporters'] = {
                  career_vision: supporterzData.career_vision || '',
                  self_promotion: supporterzData.self_promotion || '',
                  skills: supporterzData.skills || [],
                  skill_descriptions: supporterzData.skill_descriptions || [],
                  intern_experiences: supporterzData.intern_experiences || [],
                  intern_experience_descriptions: supporterzData.intern_experience_descriptions || [],
                  products: supporterzData.products || [],
                  product_tech_stacks: supporterzData.product_tech_stacks || [],
                  product_descriptions: supporterzData.product_descriptions || [],
                  researches: supporterzData.researches || [],
                  research_descriptions: supporterzData.research_descriptions || [],
                };
              }

              // プロフィール（マイエントリーシート）のデータを設定
              if (serviceData.data.profile) {
                const profileData = serviceData.data.profile;
                
                // インターン経験のデータを正しい形式に変換
                const internExperiences = [];
                if (profileData.interns && profileData.intern_descriptions) {
                  const interns = profileData.interns || [];
                  const descriptions = profileData.intern_descriptions || [];
                  
                  for (let i = 0; i < Math.max(interns.length, descriptions.length); i++) {
                    internExperiences.push({
                      name: interns[i] || '',
                      description: descriptions[i] || ''
                    });
                  }
                }
                
                initialFormData['myES'] = {
                  career_vision: profileData.career_vision || '',
                  self_promotion: profileData.self_promotion || '',
                  gakuchika: profileData.gakuchika || '',
                  ideal_engineer: profileData.ideal_engineer || '',
                  skills: profileData.skills || [],
                  works: profileData.works || [],
                  experiences: internExperiences,
                  certifications: profileData.certifications || [],
                };
              }

              setFormTexts(initialFormData);
            } else {
              // サービスが選択されていない場合でもマイエントリーシートは表示
              const myESService = servicesData.find(service => service.id === "myES");
              if (myESService) {
                setUserServices([myESService]);
                setActiveTab("myES");
              }
            }
          } else {
            console.error('API request failed:', response.status);
            // エラーの場合もマイエントリーシートは表示
            const myESService = servicesData.find(service => service.id === "myES");
            if (myESService) {
              setUserServices([myESService]);
              setActiveTab("myES");
            }
          }

        } catch (error) {
          console.error('Error fetching service details:', error);
          // エラーの場合もマイエントリーシートは表示
          const myESService = servicesData.find(service => service.id === "myES");
          if (myESService) {
            setUserServices([myESService]);
            setActiveTab("myES");
          }
        }

      } else {
        // ログインしていない場合でもマイエントリーシートは表示
        const myESService = servicesData.find(service => service.id === "myES");
        if (myESService) {
          setUserServices([myESService]);
          setActiveTab("myES");
        }
      }

      // ログイン状態に関係なくログデータを取得
      try {
        // const testUserId = 'b867c4ed-e2c5-46eb-a50d-35c62a1e22a2'; // 固定UUID（後で使うかもしれないのでコメントアウト）
        const userId = user?.id;
        if (userId) {
          const logResponse = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_LOG(userId)}`);
          
          if (logResponse.ok) {
            const logData = await logResponse.json();
            console.log('API log data:', logData);
            setLastUpdated(logData);
          } else {
            console.error('Log API request failed:', logResponse.status);
            setLastUpdated({});
          }
        } else {
          console.log('User not logged in, skipping log data fetch');
          setLastUpdated({});
        }
      } catch (error) {
        console.error('Error fetching log data:', error);
        setLastUpdated({});
      }

      setIsLoading(false); // 全てのデータ取得が終わったらローディングを解除
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
    // 1. 新しい日時を生成
    const newTimestamp = new Date().toISOString();

    // 2. lastUpdated Stateを更新
    const logKey = SERVICE_TO_LOG_KEY[serviceId] || serviceId;
    setLastUpdated((prev) => ({
      ...prev,
      [logKey]: {
        ...prev[logKey],
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
    // formTextsからデータを取得
    const dataToCopy = formTexts[serviceId]?.[fieldId];

    // データが文字列型であることを確認
    if (typeof dataToCopy === "string") {
      // 文字列であればクリップボードにコピー
      navigator.clipboard.writeText(dataToCopy);
    }
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
    <div className="min-h-screen bg-gray-50 relative">
      {/* AI生成中のローディングオーバーレイ */}
      {isGenerating && (
        <div className="fixed inset-0 bg-gray-300 bg-opacity-30 z-50">
          {/* ヘッダー */}
          <header className="bg-blue-500 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-2xl font-bold text-white py-4 text-center">キャリマネ</h1>
            </div>
          </header>
          
          {/* ローディング表示 */}
          <div className="flex items-center justify-center min-h-screen -mt-16">
            <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center shadow-xl">
              <div className="mb-6">
                <PulseLoader
                  color="#3b82f6"
                  size={15}
                  margin={2}
                  speedMultiplier={0.8}
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI生成中</h3>
              <p className="text-gray-600 mb-2">ローディング</p>
              <p className="text-sm text-gray-500">生成中は現在のページを操作しないでください。</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <header className="bg-blue-500 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-white py-4 text-center">キャリマネ</h1>
        </div>
      </header>

      <div className="w-full max-w-5xl mx-auto p-4 md:p-8 mt-4">
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
            <button 
              onClick={handleBatchGenerate}
              disabled={isGenerating}
              className={`${
                isGenerating 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[#1760a0] hover:scale-105'
              } text-white font-bold py-2 px-6 rounded-lg text-base transition-all duration-200`}
            >
              {isGenerating ? '生成中...' : '一括生成'}
            </button>
          </div>
        )}
        {currentService && (
          <form className="space-y-8">
            {currentService.fields.map((field) => {
              // ===========================================
              // ▼▼▼ マイエントリーシートのSimpleItem形式 ▼▼▼
              // ===========================================
              if (
                field.type === "structured_list" && 
                currentService.id === "myES" &&
                (field.id === "skills" || field.id === "works" || field.id === "experiences" || field.id === "certifications")
              ) {
                const isEditing = editingSections[currentService.id]?.[field.id] || false;
                const items = (formTexts[currentService.id]?.[field.id] || []) as SimpleItem[];
                const logKey = SERVICE_TO_LOG_KEY[currentService.id] || currentService.id;
                const updatedAtTimestamp = lastUpdated[logKey]?.[field.id];
                const lastUpdatedTime = updatedAtTimestamp
                  ? formatDateTime(updatedAtTimestamp)
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
                            onClick={() => handleSaveSimpleItems(currentService.id, field.id, field.label)}
                            className="text-gray-500 hover:text-green-500"
                          >
                            <FaSave />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleEditSection(currentService.id, field.id)}
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
                          {items.map((item, index) => (
                            <div
                              key={index}
                              className="border rounded-lg p-4 relative bg-gray-50"
                            >
                              <button
                                type="button"
                                onClick={() => handleRemoveSimpleItem(currentService.id, field.id, index)}
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
                                  <textarea
                                    rows={subField.id === "description" ? 5 : 2}
                                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                    placeholder={`${subField.label}を入力してください`}
                                    value={subField.id === "name" ? item.name : item.description || ""}
                                    onChange={(e) =>
                                      handleSimpleItemChange(
                                        currentService.id,
                                        field.id,
                                        index,
                                        subField.id,
                                        e.target.value
                                      )
                                    }
                                    maxLength={subField.charLimit || undefined}
                                  />
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                        <div className="mt-4">
                          <button
                            type="button"
                            onClick={() => handleAddSimpleItem(currentService.id, field.id)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                          >
                            + {field.label}を追加
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {items.map((item, index) => (
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
                                    {subField.id === "name" ? item.name : item.description}
                                  </dd>
                                </div>
                              ))}
                            </dl>
                          </div>
                        ))}
                        {items.length === 0 && (
                          <p className="text-gray-500">登録されていません。</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              }

              // ===========================================
              // ▼▼▼ サポーターズのスキル ▼▼▼
              // ===========================================
              if (field.type === "structured_list" && field.id === "skills" && currentService.id === "supporters") {
                const isEditing =
                  editingSections[currentService.id]?.[field.id] || false;
                const skills = (formTexts[currentService.id]?.[field.id] ||
                  []) as ProgrammingSkill[];
                const logKey = SERVICE_TO_LOG_KEY[currentService.id] || currentService.id;
                const updatedAtTimestamp =
                  lastUpdated[logKey]?.[field.id];
                const lastUpdatedTime = updatedAtTimestamp
                  ? formatDateTime(updatedAtTimestamp)
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
                                  {subField.type === "select" &&
                                  'options' in subField && subField.options ? (
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
                                      {/* optionsが存在することを確認したので、`?`を削除し、型を明示的に指定 */}
                                      {('options' in subField ? subField.options : [])?.map(
                                        (option: string) => (
                                          <option key={option} value={option}>
                                            {option}
                                          </option>
                                        )
                                      )}
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
              // ▼▼▼ サポーターズの 'intern_experiences' ▼▼▼
              // =======================================================
              if (
                field.type === "structured_list" &&
                field.id === "intern_experiences" &&
                currentService.id === "supporters"
              ) {
                const isEditing =
                  editingSections[currentService.id]?.[field.id] || false;
                const internships = (formTexts[currentService.id]?.[field.id] ||
                  []) as Internship[];
                const logKey = SERVICE_TO_LOG_KEY[currentService.id] || currentService.id;
                const updatedAtTimestamp =
                  lastUpdated[logKey]?.[field.id];
                const lastUpdatedTime = updatedAtTimestamp
                  ? formatDateTime(updatedAtTimestamp)
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
                                    ></select>
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
                // ▼▼▼ サポーターズの 'researches' ▼▼▼
                // =================================================
                if (
                  field.type === "structured_list" &&
                  field.id === "researches" &&
                  currentService.id === "supporters"
                ) {
                  const isEditing =
                    editingSections[currentService.id]?.[field.id] || false;
                  const researches = (formTexts[currentService.id]?.[
                    field.id
                  ] || []) as Research[];
                  const logKey = SERVICE_TO_LOG_KEY[currentService.id] || currentService.id;
                  const updatedAtTimestamp =
                    lastUpdated[logKey]?.[field.id];
                  const lastUpdatedTime = updatedAtTimestamp
                    ? formatDateTime(updatedAtTimestamp)
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
                                        {subField.charLimit && subField.charLimit > 0 && ` (${subField.charLimit}文字以内)`}
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
                // ▼▼▼ サポーターズの 'products' ▼▼▼
                // =================================================
                if (
                  field.type === "structured_list" &&
                  field.id === "products" &&
                  currentService.id === "supporters"
                ) {
                  const isEditing =
                    editingSections[currentService.id]?.[field.id] || false;
                  const products = (formTexts[currentService.id]?.[field.id] ||
                    []) as Product[];
                  const logKey = SERVICE_TO_LOG_KEY[currentService.id] || currentService.id;
                  const updatedAtTimestamp =
                    lastUpdated[logKey]?.[field.id];
                  const lastUpdatedTime = updatedAtTimestamp
                    ? formatDateTime(updatedAtTimestamp)
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
                                      ></select>
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
              const logKey = SERVICE_TO_LOG_KEY[currentService.id] || currentService.id;
              const updatedAtTimestamp =
                lastUpdated[logKey]?.[field.id];
              const lastUpdatedTime = updatedAtTimestamp
                ? formatDateTime(updatedAtTimestamp)
                : "未更新";
              return (
                <div key={field.id} className="relative">
                  <label className="block text-lg font-semibold text-gray-700 mb-2">
                    {field.label}
                    {field.charLimit && field.charLimit > 0 && ` (${field.charLimit}文字以内)`}
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
    </div>
  );
}

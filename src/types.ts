// src/types.ts
export type Form = {
  lastName: string;
  firstName: string;
  lastNameKana: string;
  firstNameKana: string;
  birthDate: string;
  university: string;
  grade: string;
  faculty: string;
  department: string;
  track: string;
  seminar: string;
  jobs: string | string[];   // 今は単一選択の使い方なので string でOK
  selfPr: string;
  gakuchika: string;
  research: string;
  age?: number | string;     // 追加して使っているので許容
};

// バックエンドのCreateUserData構造体に対応する型
export type CreateUserData = {
  last_name: string;
  first_name: string;
  birth_date?: string | null;  // ISO 8601 format string (YYYY-MM-DD) or null
  age: number;
  university: string;
  category: string;     // 学部・学科系統
  faculty: string;
  grade: number;
  target_job_type: string;
};

// バックエンドのProfileData構造体に対応する型
export type ProfileData = {
  career_vision: string;              // キャリアビジョン
  self_promotion: string;             // 自己PR
  student_experience: string;         // ガクチカ
  research: string;                   // 研究内容
  products: string[];                 // 製作物・開発経験（配列）
  product_descriptions: string[];     // 製作物説明（配列）
  skills: string[];                   // スキル（配列）
  skill_descriptions: string[];       // スキル説明（配列）
  interns: string[];                  // インターン・アルバイト経験（配列）
  intern_descriptions: string[];      // インターン説明（配列）
  organization: string;               // 部活・サークル・団体活動経験
  certifications: string[];           // 資格（配列）
  certification_descriptions: string[]; // 資格説明（配列）
  desired_job_type: string;           // 希望職種
  company_selection_criteria: string; // 企業選びの軸
  engineer_aspiration: string;        // 理想のエンジニア像
};

// フロントエンド内部で使用するプロフィール型（UIに最適化）
export type Profile = {
  // テキスト系の大項目
  careerVision: string;        // キャリアビジョン
  selfPR: string;             // 自己PR
  gakuchika: string;          // ガクチカ
  research: string;           // 研究内容
  
  // 追加：テキストエリア形式
  activities: string;         // 部活・サークル・団体活動経験
  desiredRolesText: string;   // 希望職種（テキスト）
  companyAxesText: string;    // 企業選びの軸（テキスト）
  idealEngineer: string;      // 理想のエンジニア像（テキスト）
  
  // 制作物・開発経験（カード配列）
  works: Array<{ overview: string; techStack: string; otherUrl: string }>;
  
  // スキル（配列）
  skills: Array<{ name: string; description: string }>;
  
  // 経験（サポーターズ風）
  experiences: {
    internships: Array<{ org: string; period: string; details: string }>;
    parttime: Array<{ org: string; role: string; period: string; details: string }>;
    activities: Array<{ org: string; role: string; period: string; details: string }>;
  };
  
  // 資格の配列
  certifications: Array<{ name: string; description: string }>;
  
  // 旧フィールド（未使用）
  desiredRoles: string[];
  companyAxes: string[];
};

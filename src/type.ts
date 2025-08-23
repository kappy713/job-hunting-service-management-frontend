// src/types.ts
export type Form = {
  lastName: string;
  firstName: string;
  lastNameKana: string;
  firstNameKana: string;
  birthDate: string;   // "YYYY/MM/DD"
  university: string;
  grade: string;
  faculty: string;
  department: string;
  track: string;
  seminar: string;
  jobs: string;        // ← 単一選択に統一（UIがselectだから）
  selfPr: string;
  gakuchika: string;
  research: string;
  age: number | null;  // ← 未選択は null
};

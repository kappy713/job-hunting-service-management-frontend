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

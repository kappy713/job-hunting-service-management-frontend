export interface SampleUser {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  name: string;
  email: string;
  age: number;
  is_active: boolean;
  bio?: string;
  website?: string;
}

// 作成用の型（IDや自動生成されるフィールドを除外）
export interface CreateSampleUserRequest {
  name: string;
  email: string;
  age: number;
  is_active?: boolean;
  bio?: string;
  website?: string;
}

// 更新用の型（部分的な更新を許可）
export type UpdateSampleUserRequest = Partial<CreateSampleUserRequest>;

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

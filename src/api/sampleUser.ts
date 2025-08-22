import { apiFetch, API_CONFIG } from './config';
import type { SampleUser } from '../types/sampleUser';

// 作成用の型（IDや自動生成されるフィールドを除外）
export type CreateSampleUserRequest = {
  name: string;
  email: string;
  age: number;
  is_active?: boolean;
  bio?: string;
  website?: string;
};

// 更新用の型（部分的な更新を許可）
export type UpdateSampleUserRequest = Partial<CreateSampleUserRequest>;

export const sampleUserAPI = {
  // 全てのサンプルユーザーを取得
  getAll: async (): Promise<SampleUser[]> => {
    return apiFetch<SampleUser[]>(API_CONFIG.ENDPOINTS.SAMPLE_USERS);
  },

  // 特定のサンプルユーザーを取得
  getById: async (id: number): Promise<SampleUser> => {
    return apiFetch<SampleUser>(`${API_CONFIG.ENDPOINTS.SAMPLE_USERS}/${id}`);
  },

  // サンプルユーザーを作成
  create: async (userData: CreateSampleUserRequest): Promise<SampleUser> => {
    return apiFetch<SampleUser>(API_CONFIG.ENDPOINTS.SAMPLE_USERS, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
};

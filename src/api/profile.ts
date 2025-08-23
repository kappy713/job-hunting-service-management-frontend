import { apiFetch } from './config';
import { supabase } from '../utils/supabase';
import type { ProfileData } from '../types';

// プロフィール作成用のリクエスト型
export type CreateProfileRequest = {
  user_id: string;
  data: ProfileData;
};

export const profileAPI = {
  // プロフィールを作成/更新
  createOrUpdate: async (profileData: ProfileData): Promise<void> => {
    // Supabaseから現在のユーザーIDを取得
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      throw new Error(`認証エラー: ${error.message}`);
    }
    
    if (!user) {
      throw new Error('ユーザーが認証されていません');
    }

    // リクエストボディを構築
    const requestBody: CreateProfileRequest = {
      user_id: user.id,
      data: profileData,
    };

    // バックエンドAPIに送信
    return apiFetch<void>('/api/profile', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
  },
};

import { apiFetch } from './config';
import { supabase } from '../utils/supabase';
import type { CreateUserData } from '../types';

// ユーザー作成用のリクエスト型
export type CreateUserRequest = {
  user_id: string;
  data: CreateUserData;
};

// サービス更新用のリクエスト型
export type UpdateServicesRequest = {
  user_id: string;
  services: string[];
};

export const userAPI = {
  // ユーザーを作成
  create: async (userData: CreateUserData): Promise<void> => {
    // Supabaseから現在のユーザーIDを取得
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      throw new Error(`認証エラー: ${error.message}`);
    }
    
    if (!user) {
      throw new Error('ユーザーが認証されていません');
    }

    // リクエストボディを構築
    const requestBody: CreateUserRequest = {
      user_id: user.id,
      data: userData,
    };

    console.log('送信するリクエスト - user_id:', user.id);
    console.log('送信するデータ:', userData);

    // バックエンドAPIに送信
    return apiFetch<void>('/api/users', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
  },

  // ユーザーのサービスを更新
  updateServices: async (services: string[]): Promise<void> => {
    // Supabaseから現在のユーザーIDを取得
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      throw new Error(`認証エラー: ${error.message}`);
    }
    
    if (!user) {
      throw new Error('ユーザーが認証されていません');
    }

    // リクエストボディを構築
    const requestBody: UpdateServicesRequest = {
      user_id: user.id,
      services: services,
    };

    console.log('送信するサービス更新リクエスト - user_id:', user.id);
    console.log('選択されたサービス:', services);

    // バックエンドAPIに送信
    return apiFetch<void>('/api/users/services', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
  },
};

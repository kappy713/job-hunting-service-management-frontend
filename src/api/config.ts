// API設定
const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_BACKEND_URL;
  
  // デバッグ用：環境変数の値をコンソールに出力
  console.log('🔍 DEBUG: VITE_BACKEND_URL =', envUrl);
  console.log('🔍 DEBUG: typeof VITE_BACKEND_URL =', typeof envUrl);
  console.log('🔍 DEBUG: import.meta.env =', import.meta.env);
  
  // 環境変数が設定されていない、または空の場合のフォールバック
  if (!envUrl || envUrl.trim() === '' || envUrl === 'undefined') {
    console.warn('VITE_BACKEND_URL is not set, using default localhost');
    // 本番環境では実際のバックエンドURLに変更してください
    return import.meta.env.PROD ? 'http://localhost:8080' : 'http://localhost:8080';
  }
  
  // URLの妥当性をチェック
  try {
    new URL(envUrl);
    console.log('✅ Valid URL:', envUrl);
    return envUrl;
  } catch (error) {
    console.error('Invalid VITE_BACKEND_URL:', envUrl, error);
    return 'http://localhost:8080'; // より安全なフォールバック
  }
};

export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  ENDPOINTS: {
    SAMPLE_USERS: '/api/sample-users',
  },
} as const;

// デバッグ用：最終的なAPI設定を出力
console.log('🔧 DEBUG: Final API_CONFIG =', API_CONFIG);

// API呼び出しのベースfetch関数
export const apiFetch = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  // URL構築の安全性チェック
  if (!endpoint) {
    throw new Error('Endpoint is required');
  }
  
  const baseUrl = API_CONFIG.BASE_URL;
  const url = `${baseUrl}${endpoint}`;
  
  // 最終的なURLの妥当性チェック
  try {
    new URL(url);
  } catch {
    throw new Error(`Invalid URL constructed: ${url}`);
  }
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      // エラーレスポンスの詳細を取得
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.error) {
          errorMessage += ` - ${errorData.error}`;
        }
        console.error('API Error Details:', errorData);
      } catch {
        console.error('Could not parse error response as JSON');
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
};

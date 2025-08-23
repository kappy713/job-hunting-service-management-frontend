// src/routes/register.tsx
import { useNavigate } from 'react-router-dom';
import RegistrationForm from '../components/RegistrationForm';
import type { Form, CreateUserData } from '../types';

export default function Register() {
  const navigate = useNavigate();

  // フォームデータをバックエンド形式に変換する関数
  function convertToCreateUserData(form: Form): CreateUserData {
    // 学年の文字列を数値にマッピング
    const gradeMapping: { [key: string]: number } = {
      "学部1年": 1,
      "学部2年": 2,
      "学部3年": 3,
      "学部4年": 4,
      "修士1年": 5,
      "修士2年": 6,
      "博士1年": 7,
      "博士2年": 8,
      "博士3年": 9,
      "既卒": 10,
    };

    return {
      last_name: form.lastName.trim(),
      first_name: form.firstName.trim(),
      birth_date: form.birthDate ? form.birthDate : undefined,
      age: typeof form.age === 'string' ? parseInt(form.age, 10) : (form.age || 0),
      university: form.university.trim(),
      category: form.track, // 学部・学科系統 (track) をcategoryに
      faculty: form.faculty.trim(),
      grade: gradeMapping[form.grade] || 1,
      target_job_type: typeof form.jobs === 'string' ? form.jobs : (form.jobs[0] || ''),
    };
  }

  const handleSubmit = (validatedForm: Form) => {
    // フォームデータを保存
    localStorage.setItem('userFormData', JSON.stringify(validatedForm));
    
    // バックエンド形式に変換してデバッグ確認
    const backendData = convertToCreateUserData(validatedForm);
    console.log('バックエンド送信用データ:', backendData);
    
    // バックエンド形式も保存（将来のAPI送信用）
    localStorage.setItem('userBackendData', JSON.stringify(backendData));
    
    alert('登録が完了しました！プロフィール画面で詳細を編集できます。');
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <div className="bg-blue-600 text-white text-center py-4">
        <h1 className="text-2xl font-bold">キャリマネ</h1>
      </div>
      
      {/* メインコンテンツ */}
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">ユーザー登録</h2>
        <RegistrationForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}

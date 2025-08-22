import React from 'react';
import type { SampleUser } from '../types/sampleUser';

interface SampleUserCardProps {
  user: SampleUser;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const SampleUserCard: React.FC<SampleUserCardProps> = ({ user }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          user.is_active 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {user.is_active ? 'Active' : 'Inactive'}
        </span>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Age:</strong> {user.age}歳</p>
        
        {user.bio && (
          <div>
            <strong>Bio:</strong>
            <p className="mt-1 text-gray-700">{user.bio}</p>
          </div>
        )}
        
        {user.website && (
          <p>
            <strong>Website:</strong> 
            <a 
              href={user.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 ml-1"
            >
              {user.website}
            </a>
          </p>
        )}
        
        <div className="pt-2 border-t border-gray-100 text-xs text-gray-500">
          <p>作成日: {formatDate(user.created_at)}</p>
          <p>更新日: {formatDate(user.updated_at)}</p>
        </div>
      </div>
    </div>
  );
};

interface SampleUserListProps {
  users: SampleUser[];
  loading?: boolean;
  error?: string;
}

export const SampleUserList: React.FC<SampleUserListProps> = ({ 
  users, 
  loading = false, 
  error 
}) => {
  if (loading) {
    return <div className="text-center py-8 text-gray-600">読み込み中...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600 bg-red-50 rounded-lg p-4">エラーが発生しました: {error}</div>;
  }

  if (users.length === 0) {
    return <div className="text-center py-8 text-gray-500">ユーザーが見つかりません</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {users.map((user) => (
        <SampleUserCard key={user.id} user={user} />
      ))}
    </div>
  );
};

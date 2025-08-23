import { useState, useEffect } from 'react';
import { SampleUserList } from '../components/SampleUserComponents';
import { sampleUserAPI } from '../api/sampleUser';
import type { SampleUser } from '../types/sampleUser';

export default function SampleUsersPage() {
  const [users, setUsers] = useState<SampleUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await sampleUserAPI.getAll();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        console.error('Failed to fetch users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRefresh = () => {
    setUsers([]);
    setError(null);
    setLoading(true);
    // useEffectが再実行される
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Sample Users</h1>
            <button 
              onClick={handleRefresh} 
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '読み込み中...' : '更新'}
            </button>
          </div>
        </header>
        
        <main>
          <SampleUserList 
            users={users} 
            loading={loading} 
            error={error || undefined} 
          />
        </main>
      </div>
    </div>
  );
}

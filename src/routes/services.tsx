import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userAPI } from "../api/user";

const jobServices = [
  { value: "mynavi", name: "マイナビ" },
  { value: "rebatekku", name: "レバテックルーキー" },
  { value: "onecareer", name: "ワンキャリア" },
  { value: "supporters", name: "サポーターズ" },
  { value: "careeselect", name: "キャリアセレクト" },
  { value: "gyakunavi", name: "逆求人ナビ" },
];

export default function Services() {
  const navigate = useNavigate();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleServiceClick = (serviceName: string) => {
    if (selectedServices.includes(serviceName)) {
      setSelectedServices(
        selectedServices.filter((value) => value !== serviceName)
      );
    } else {
      setSelectedServices([...selectedServices, serviceName]);
    }
  };

  const handleSave = async () => {
    if (selectedServices.length === 0) {
      console.warn('サービスが選択されていません');
      return;
    }

    try {
      setIsLoading(true);
      console.log('サービス更新開始:', selectedServices);
      
      // バックエンドAPIに送信（日本語のサービス名をそのまま送信）
      await userAPI.updateServices(selectedServices);
      
      console.log('サービス更新完了');
      navigate('/');
    } catch (error) {
      console.error('サービス更新エラー:', error);
      console.error(`更新に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex-col bg-[#4699ca]/10 justify-center items-center relative">
      {/* ローディングオーバーレイ */}
      {isLoading && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center shadow-xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-lg font-semibold text-gray-700">AI生成中</p>
          </div>
        </div>
      )}
      
      <header className="w-full bg-blue-600 shadow-md">
        {/* ↓ ポイント: このdivで囲む */}
        <div className="container mx-auto px-6 py-4 text-white font-bold text-center text-3xl">
          <nav>キャリマネ</nav>
        </div>
      </header>
      <div className="pt-8 max-w-2xl bg-white p-3 rounded-2xl shadow-xl justify-center items-center translate-x-85 mt-5">
        <h1 className="text-3xl font-semibold mb-10 text-center pt-4">
          登録予定の就活サービスを全て選択してください
        </h1>
        <div className="flex flex-wrap gap-7 max-w-2xl justify-center items-center">
          {jobServices.map((service) => {
            const isSelected = selectedServices.includes(service.name);
            return (
              <div key={service.value} className="relative group">
                <button
                  onClick={() => handleServiceClick(service.name)}
                  className={`
                    w-38 h-38 rounded-full border-2 transition-all duration-300 transform hover:scale-110
                    flex items-center justify-center
                    ${
                      isSelected
                        ? "bg-cyan-500/30 border-cyan-400 shadow-lg shadow-cyan-500/20"
                        : "border-gray-400/20 hover:bg-white/20 shadow-lg"
                    }
                  `}
                >
                  <div className="flex flex-col items-center justify-center -mt-3">
                    <img
                      src={`/logos/${service.value}.png`}
                      alt={service.name}
                      className="h-20 w-20 object-contain"
                    />
                    <span className="font-semibold">{service.name}</span>
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-8 translate-x-135">
          <button
            onClick={handleSave}
            className="bg-gradient-to-r from-[#1760a0] to-[#1760a0] font-bold py-3 px-9 rounded-md transition-all duration-300 transform hover:scale-105 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={selectedServices.length === 0 || isLoading}
          >
            {isLoading ? '処理中...' : '決定'}
          </button>
        </div>
      </div>
    </div>
  );
}

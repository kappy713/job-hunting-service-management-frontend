import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import { FaPencilAlt, FaCopy, FaSave } from "react-icons/fa";

type EditableTextFieldProps = {
  userId: string;
  field: {
    id: string;
    label: string;
    charLimit: number;
    recommended: string;
  };
};

export default function EditableTextField({
  userId,
  field,
}: EditableTextFieldProps) {
  const [text, setText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // コンポーネント表示時に、最終更新日時を取得する
  useEffect(() => {
    async function fetchLastUpdated() {
      const { data, error } = await supabase
        .from("logs")
        .select("updated_at")
        .eq("user_id", userId)
        .eq("field_name", field.id) // この項目のログに絞る
        .order("updated_at", { ascending: false }) // 新しい順に並び替え
        .limit(1) // 最新の1件だけ取得
        .single();

      if (data && data.updated_at) {
        // 日時を分かりやすい形式にフォーマット
        const formattedDate = new Date(data.updated_at).toLocaleString("ja-JP");
        setLastUpdated(formattedDate);
      }
      if (error) {
        console.error("Error fetching logs:", error);
      }
    }
    fetchLastUpdated();
  }, [userId, field.id]);

  const handleSave = () => {
    setIsEditing(false);
    // ここでSupabaseにテキストを保存する処理を呼び出す
    console.log(`保存: ${field.label} - ${text}`);
    alert("保存しました！");
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-lg font-semibold text-gray-700">
          {field.label} ({field.charLimit}文字)
        </label>

        {/* --- アイコンエリア --- */}
        <div className="flex items-center space-x-3 text-gray-400">
          {/* ★ 最終更新日時を表示 */}
          {lastUpdated && !isEditing && (
            <span className="text-xs text-gray-500">
              最終更新: {lastUpdated}
            </span>
          )}
          {isEditing ? (
            <button onClick={handleSave} className="hover:text-green-500">
              <FaSave />
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="hover:text-blue-500"
            >
              <FaPencilAlt />
            </button>
          )}
          <button
            onClick={() => navigator.clipboard.writeText(text)}
            className="hover:text-blue-500"
          >
            <FaCopy />
          </button>
        </div>
      </div>

      <textarea
        rows={8}
        className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
        placeholder={field.recommended}
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={!isEditing}
      />
    </div>
  );
}

# キャリマネのフロントエンドリポジトリ

## キャリマネとは？
就活サービスの情報(自己PRやキャリア観、スキルなど)を一元管理するプロダクト<br>
キャリマネで書いたESから複数の就活サービスに対応する項目を生成できる

## 開発環境
- Node.js：22.18.0
- React：19.1.1
- Vite：7.1.2
- TailwindCSS：4.1.12
- React Router：7.8.1

## セットアップ手順
1. リポジトリをローカルに取り込む
```
git clone git@github.com:kappy713/job-hunting-service-management-frontend.git
```
2. パッケージのインストール
```
npm install
```
3. 環境変数の設定
```env
VITE_BACKEND_URL=YOUR_BACKEND_URL
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_API_KEY=YOUR_SUPABASE_API_KEY
```
4. 開発用サーバーの起動
```
npm run dev
```
上記コマンド実行後、http://localhost:5173/ にアクセス<br>
※サーバーを停止させたい場合はCtrl+Cを実行

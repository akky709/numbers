# Numbers Analytics

ナンバーズ3・4の当選番号を詳細に分析するデータドリブンな分析サイト

## 技術スタック

- **Next.js 14** (App Router)
- **TypeScript**
- **MySQL** (データベース)
- **CSS** (カスタムスタイリング)

## 機能

### 実装済み
- レスポンシブデザイン
- ナビゲーション（ヘッダー・フッター）
- トップページ（ヒーロー、最新結果、統計概要）
- 下層ページの基本構造

### 開発予定
- MySQLデータベース連携
- 最新当選番号の表示
- 過去の当選データ検索・閲覧
- 数字の出現頻度分析
- ホット・コールド数字の特定
- 統計的なトレンド分析
- 予測支援機能

## セットアップ

### 1. 依存関係のインストール
```bash
npm install
```

### 2. 環境変数の設定
`.env.local` ファイルを作成し、以下の変数を設定してください：

```env
# MySQL Database Configuration
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=lottery_db
DB_PORT=3306

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. データベースの準備
MySQLデータベースに以下のテーブルを作成してください：

```sql
-- ナンバーズ3用テーブル
CREATE TABLE numbers3 (
  id INT AUTO_INCREMENT PRIMARY KEY,
  draw_number INT NOT NULL UNIQUE,
  date DATE NOT NULL,
  numbers VARCHAR(3) NOT NULL,
  type VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ナンバーズ4用テーブル
CREATE TABLE numbers4 (
  id INT AUTO_INCREMENT PRIMARY KEY,
  draw_number INT NOT NULL UNIQUE,
  date DATE NOT NULL,
  numbers VARCHAR(4) NOT NULL,
  type VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. 開発サーバーの起動
```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## API エンドポイント

### ナンバーズ3
- `GET /api/numbers3/latest` - 最新の当選番号
- `GET /api/numbers3/history?limit=100` - 過去の当選番号

### ナンバーズ4
- `GET /api/numbers4/latest` - 最新の当選番号
- `GET /api/numbers4/history?limit=100` - 過去の当選番号

### 統計
- `GET /api/stats/frequency` - 数字の出現頻度

## ディレクトリ構造

```
├── app/
│   ├── components/          # 共通コンポーネント
│   ├── api/                # API ルート
│   ├── numbers3/           # ナンバーズ3ページ
│   ├── numbers4/           # ナンバーズ4ページ
│   ├── about/              # このサイトについて
│   └── globals.css         # グローバルスタイル
├── lib/
│   └── database.ts         # データベース接続・操作
└── .env.local              # 環境変数
```

## 免責事項

当サイトは宝くじの当選を保証するものではありません。すべての投資・購入は自己責任でお願いします。当サイトは公式サイトではありません。
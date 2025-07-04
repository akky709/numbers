export default function Numbers4Page() {
  return (
    <div className="container" style={{ padding: '120px 20px 40px' }}>
      <h1>ナンバーズ4 詳細分析</h1>
      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-content">
          <p>ナンバーズ4の詳細分析ページです。（開発中）</p>
          <p>MySQLデータベースとの連携準備が完了次第、以下の機能を実装予定：</p>
          <ul>
            <li>過去の当選番号一覧</li>
            <li>数字別出現頻度分析</li>
            <li>4桁組み合わせ分析</li>
            <li>統計ダッシュボード</li>
            <li>予測支援機能</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
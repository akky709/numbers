import React from 'react';

function AboutPage() {
  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1>このサイトについて</h1>
      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-content">
          <h2>Numbers Analytics とは</h2>
          <p>
            Numbers Analytics は、ナンバーズ3・4の当選番号を詳細に分析し、
            データドリブンな洞察を提供する専門サイトです。
          </p>
          
          <h3>主な機能</h3>
          <ul>
            <li>最新の当選番号表示</li>
            <li>過去の当選データの検索・閲覧</li>
            <li>数字の出現頻度分析</li>
            <li>ホット・コールド数字の特定</li>
            <li>統計的なトレンド分析</li>
          </ul>
          
          <h3>免責事項</h3>
          <p>
            当サイトは宝くじの当選を保証するものではありません。
            すべての投資・購入は自己責任でお願いします。
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
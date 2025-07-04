import { useMemo } from 'react';

function Dashboard({ data, stats, onScrape, loading }) {
  const dashboardStats = useMemo(() => {
    if (!data || data.length === 0) return null;

    const totalDraws = data.length;
    const latestDraw = data[0];
    
    // 最新の10回分の当選番号
    const recentNumbers = data.slice(0, 10);
    
    // 各桁の最頻出数字
    const mostFrequentDigits = stats?.digitFrequency ? 
      Object.keys(stats.digitFrequency).map(position => {
        const frequencies = stats.digitFrequency[position];
        const maxFreq = Math.max(...frequencies);
        const mostFrequentDigit = frequencies.indexOf(maxFreq);
        return { position: parseInt(position) + 1, digit: mostFrequentDigit, frequency: maxFreq };
      }) : [];

    return {
      totalDraws,
      latestDraw,
      recentNumbers,
      mostFrequentDigits
    };
  }, [data, stats]);

  if (!dashboardStats) {
    return (
      <div className="card">
        <h2>データを読み込み中...</h2>
        <button className="btn btn-primary" onClick={onScrape} disabled={loading}>
          {loading ? (
            <span className="loading">
              <span className="spinner"></span>
              スクレーピング中...
            </span>
          ) : (
            'データを取得'
          )}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>総抽選回数</h3>
          <p className="value">{dashboardStats.totalDraws.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h3>最新回</h3>
          <p className="value">第{dashboardStats.latestDraw.id}回</p>
        </div>
        <div className="stat-card">
          <h3>最新当選番号</h3>
          <p className="value">{dashboardStats.latestDraw.numbers}</p>
        </div>
        <div className="stat-card">
          <h3>最新抽選日</h3>
          <p className="value">{dashboardStats.latestDraw.date}</p>
        </div>
      </div>

      <div className="card">
        <h2>最新10回の当選番号</h2>
        <div className="recent-numbers">
          {dashboardStats.recentNumbers.map((draw, index) => (
            <div key={draw.id} className="recent-number-item">
              <span className="draw-number">第{draw.id}回</span>
              <span className="draw-date">{draw.date}</span>
              <span className="winning-number">{draw.numbers}</span>
            </div>
          ))}
        </div>
      </div>

      {dashboardStats.mostFrequentDigits.length > 0 && (
        <div className="card">
          <h2>各桁の最頻出数字</h2>
          <div className="frequent-digits">
            {dashboardStats.mostFrequentDigits.map((item) => (
              <div key={item.position} className="frequent-digit-item">
                <h4>{item.position}桁目</h4>
                <div className="digit-info">
                  <span className="digit">{item.digit}</span>
                  <span className="frequency">({item.frequency}回)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <h2>データ管理</h2>
        <button className="btn btn-primary" onClick={onScrape} disabled={loading}>
          {loading ? (
            <span className="loading">
              <span className="spinner"></span>
              スクレーピング中...
            </span>
          ) : (
            '最新データを取得'
          )}
        </button>
      </div>

      <style jsx>{`
        .recent-numbers {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .recent-number-item {
          display: grid;
          grid-template-columns: 100px 120px 1fr;
          gap: 1rem;
          padding: 0.75rem;
          background: rgba(102, 126, 234, 0.05);
          border-radius: 8px;
          align-items: center;
        }

        .draw-number {
          font-weight: 600;
          color: #4a5568;
        }

        .draw-date {
          color: #718096;
          font-size: 0.9rem;
        }

        .winning-number {
          font-size: 1.25rem;
          font-weight: 700;
          color: #667eea;
          font-family: 'Courier New', monospace;
          letter-spacing: 2px;
        }

        .frequent-digits {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }

        .frequent-digit-item {
          text-align: center;
          padding: 1rem;
          background: rgba(102, 126, 234, 0.05);
          border-radius: 8px;
        }

        .frequent-digit-item h4 {
          margin: 0 0 0.5rem 0;
          color: #4a5568;
          font-size: 0.9rem;
        }

        .digit-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }

        .digit {
          font-size: 2rem;
          font-weight: 700;
          color: #667eea;
          font-family: 'Courier New', monospace;
        }

        .frequency {
          font-size: 0.8rem;
          color: #718096;
        }

        @media (max-width: 768px) {
          .recent-number-item {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Dashboard;
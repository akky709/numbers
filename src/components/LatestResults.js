import React from 'react';
import './LatestResults.css';

function LatestResults() {
  // サンプルデータ（実際のAPIから取得する予定）
  const latestNumbers3 = {
    drawNumber: 6234,
    date: '2025-01-15',
    numbers: '739',
    type: 'ストレート'
  };

  const latestNumbers4 = {
    drawNumber: 6234,
    date: '2025-01-15',
    numbers: '7392',
    type: 'ストレート'
  };

  const recentResults = [
    { date: '2025-01-14', numbers3: '582', numbers4: '5821' },
    { date: '2025-01-13', numbers3: '194', numbers4: '1947' },
    { date: '2025-01-12', numbers3: '367', numbers4: '3675' },
    { date: '2025-01-11', numbers3: '428', numbers4: '4289' },
    { date: '2025-01-10', numbers3: '051', numbers4: '0516' },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <div className="latest-results">
      <div className="grid grid-2 mb-8">
        {/* ナンバーズ3最新結果 */}
        <div className="card result-card">
          <div className="card-header">
            <h3 className="result-title">ナンバーズ3</h3>
            <span className="draw-info">第{latestNumbers3.drawNumber}回</span>
          </div>
          <div className="card-content">
            <div className="winning-numbers">
              {latestNumbers3.numbers.split('').map((digit, index) => (
                <span key={index} className="number-ball">{digit}</span>
              ))}
            </div>
            <div className="result-details">
              <span className="draw-date">{latestNumbers3.date}</span>
              <span className="draw-type">{latestNumbers3.type}</span>
            </div>
          </div>
        </div>

        {/* ナンバーズ4最新結果 */}
        <div className="card result-card">
          <div className="card-header">
            <h3 className="result-title">ナンバーズ4</h3>
            <span className="draw-info">第{latestNumbers4.drawNumber}回</span>
          </div>
          <div className="card-content">
            <div className="winning-numbers">
              {latestNumbers4.numbers.split('').map((digit, index) => (
                <span key={index} className="number-ball">{digit}</span>
              ))}
            </div>
            <div className="result-details">
              <span className="draw-date">{latestNumbers4.date}</span>
              <span className="draw-type">{latestNumbers4.type}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 過去5回の結果 */}
      <div className="card">
        <div className="card-header">
          <h3>過去5回の当選番号</h3>
        </div>
        <div className="card-content">
          <div className="recent-results-table">
            <div className="table-header">
              <span>抽選日</span>
              <span>ナンバーズ3</span>
              <span>ナンバーズ4</span>
            </div>
            {recentResults.map((result, index) => (
              <div key={index} className="table-row">
                <span className="date">{formatDate(result.date)}</span>
                <div className="numbers">
                  {result.numbers3.split('').map((digit, i) => (
                    <span key={i} className="mini-ball">{digit}</span>
                  ))}
                </div>
                <div className="numbers">
                  {result.numbers4.split('').map((digit, i) => (
                    <span key={i} className="mini-ball">{digit}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="card-footer">
            <a href="/numbers4" className="btn btn-outline">
              過去の当選番号をもっと見る
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LatestResults;
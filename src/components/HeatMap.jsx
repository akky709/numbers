import { useMemo } from 'react';

function HeatMap({ stats }) {
  const heatmapData = useMemo(() => {
    if (!stats || !stats.digitFrequency) return null;

    const { digitFrequency, totalCount } = stats;
    
    // 各桁の出現頻度を正規化（0-1の範囲）
    const normalizedData = {};
    const maxFrequencies = {};
    
    // 各桁の最大頻度を求める
    Object.keys(digitFrequency).forEach(position => {
      maxFrequencies[position] = Math.max(...digitFrequency[position]);
    });
    
    // 正規化
    Object.keys(digitFrequency).forEach(position => {
      normalizedData[position] = digitFrequency[position].map(freq => 
        maxFrequencies[position] > 0 ? freq / maxFrequencies[position] : 0
      );
    });

    return {
      digitFrequency,
      normalizedData,
      totalCount,
      maxFrequencies
    };
  }, [stats]);

  const getHeatColor = (intensity) => {
    // 青から赤へのグラデーション
    const hue = (1 - intensity) * 240; // 240 = 青, 0 = 赤
    const saturation = 70;
    const lightness = 50 + (intensity * 30); // 明度を調整
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  if (!heatmapData) {
    return (
      <div className="card">
        <h2>出現頻度ヒートマップ</h2>
        <p>統計データを読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>数字出現頻度ヒートマップ</h2>
      <p className="heatmap-description">
        各桁における数字（0-9）の出現頻度を色の濃さで表現しています。
        赤いほど出現頻度が高く、青いほど低くなります。
      </p>
      
      <div className="heatmap-container">
        <div className="heatmap-grid">
          <div className="heatmap-header">
            <div className="position-label"></div>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit => (
              <div key={digit} className="digit-label">{digit}</div>
            ))}
          </div>
          
          {Object.keys(heatmapData.digitFrequency).map(position => (
            <div key={position} className="heatmap-row">
              <div className="position-label">{parseInt(position) + 1}桁目</div>
              {heatmapData.digitFrequency[position].map((frequency, digit) => {
                const intensity = heatmapData.normalizedData[position][digit];
                const percentage = ((frequency / heatmapData.totalCount) * 100).toFixed(1);
                
                return (
                  <div
                    key={digit}
                    className="heatmap-cell"
                    style={{ backgroundColor: getHeatColor(intensity) }}
                    title={`${parseInt(position) + 1}桁目の数字${digit}: ${frequency}回 (${percentage}%)`}
                  >
                    <span className="frequency-text">{frequency}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        
        <div className="color-legend">
          <h4>出現頻度</h4>
          <div className="legend-bar">
            <div className="legend-gradient"></div>
            <div className="legend-labels">
              <span>低</span>
              <span>高</span>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-summary">
        <h3>統計サマリー</h3>
        <div className="summary-grid">
          {Object.keys(heatmapData.digitFrequency).map(position => {
            const frequencies = heatmapData.digitFrequency[position];
            const maxFreq = Math.max(...frequencies);
            const minFreq = Math.min(...frequencies);
            const mostFrequentDigit = frequencies.indexOf(maxFreq);
            const leastFrequentDigit = frequencies.indexOf(minFreq);
            
            return (
              <div key={position} className="summary-item">
                <h4>{parseInt(position) + 1}桁目</h4>
                <div className="summary-details">
                  <div>最頻出: <strong>{mostFrequentDigit}</strong> ({maxFreq}回)</div>
                  <div>最少: <strong>{leastFrequentDigit}</strong> ({minFreq}回)</div>
                  <div>差: {maxFreq - minFreq}回</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .heatmap-description {
          color: #718096;
          margin-bottom: 2rem;
          font-size: 0.95rem;
        }

        .heatmap-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .heatmap-grid {
          display: inline-block;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
        }

        .heatmap-header {
          display: grid;
          grid-template-columns: 80px repeat(10, 50px);
          background: #f7fafc;
        }

        .heatmap-row {
          display: grid;
          grid-template-columns: 80px repeat(10, 50px);
          border-top: 1px solid #e2e8f0;
        }

        .position-label {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem 0.5rem;
          background: #f7fafc;
          font-weight: 600;
          font-size: 0.85rem;
          color: #4a5568;
          border-right: 1px solid #e2e8f0;
        }

        .digit-label {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem 0.5rem;
          font-weight: 600;
          font-size: 0.9rem;
          color: #4a5568;
          border-right: 1px solid #e2e8f0;
        }

        .heatmap-cell {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem 0.5rem;
          border-right: 1px solid #e2e8f0;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }

        .heatmap-cell:hover {
          transform: scale(1.1);
          z-index: 10;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .frequency-text {
          font-weight: 600;
          font-size: 0.85rem;
          color: white;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
        }

        .color-legend {
          align-self: flex-start;
        }

        .color-legend h4 {
          margin: 0 0 0.5rem 0;
          color: #4a5568;
          font-size: 0.9rem;
        }

        .legend-bar {
          width: 200px;
        }

        .legend-gradient {
          height: 20px;
          background: linear-gradient(to right, hsl(240, 70%, 50%), hsl(0, 70%, 50%));
          border-radius: 4px;
          margin-bottom: 0.25rem;
        }

        .legend-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: #718096;
        }

        .stats-summary {
          margin-top: 2rem;
        }

        .stats-summary h3 {
          margin: 0 0 1rem 0;
          color: #2d3748;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .summary-item {
          padding: 1rem;
          background: rgba(102, 126, 234, 0.05);
          border-radius: 8px;
        }

        .summary-item h4 {
          margin: 0 0 0.75rem 0;
          color: #4a5568;
          font-size: 0.9rem;
        }

        .summary-details {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.85rem;
          color: #718096;
        }

        .summary-details strong {
          color: #667eea;
          font-weight: 700;
        }

        @media (max-width: 768px) {
          .heatmap-grid {
            font-size: 0.8rem;
          }
          
          .heatmap-header,
          .heatmap-row {
            grid-template-columns: 60px repeat(10, 35px);
          }
          
          .heatmap-cell,
          .position-label,
          .digit-label {
            padding: 0.5rem 0.25rem;
          }
        }
      `}</style>
    </div>
  );
}

export default HeatMap;
import { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function LineChart({ data }) {
  const [granularity, setGranularity] = useState(50);

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null;

    // 指定された回数分のデータを使用（逆順にして時系列順にする）
    const recentData = data.slice(0, granularity).reverse();
    
    const labels = recentData.map(item => `第${item.id}回`);
    
    // 各桁のデータセットを作成
    const datasets = [];
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];
    
    for (let digit = 0; digit < 4; digit++) {
      const digitData = recentData.map(item => {
        const numbers = item.numbers.toString().padStart(4, '0');
        return parseInt(numbers[digit]);
      });
      
      datasets.push({
        label: `${digit + 1}桁目`,
        data: digitData,
        borderColor: colors[digit],
        backgroundColor: colors[digit] + '20',
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2,
      });
    }

    return {
      labels,
      datasets,
    };
  }, [data, granularity]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      title: {
        display: true,
        text: `当選番号の推移（最新${granularity}回）`,
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: '抽選回数',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        ticks: {
          maxTicksLimit: 20,
          callback: function(value, index) {
            // 一定間隔でラベルを表示
            if (granularity <= 10 || index % Math.ceil(granularity / 10) === 0) {
              return this.getLabelForValue(value);
            }
            return '';
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: '数字',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        min: 0,
        max: 9,
        ticks: {
          stepSize: 1,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  if (!chartData) {
    return (
      <div className="card">
        <h2>履歴チャート</h2>
        <p>データを読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="chart-header">
        <h2>当選番号履歴チャート</h2>
        <div className="granularity-controls">
          <label htmlFor="granularity">表示回数:</label>
          <select
            id="granularity"
            value={granularity}
            onChange={(e) => setGranularity(parseInt(e.target.value))}
            className="granularity-select"
          >
            <option value={10}>10回</option>
            <option value={50}>50回</option>
            <option value={100}>100回</option>
          </select>
        </div>
      </div>
      
      <div className="chart-container">
        <div className="chart-wrapper" style={{ width: `${Math.max(800, granularity * 15)}px`, height: '600px' }}>
          <Line data={chartData} options={options} />
        </div>
      </div>
      
      <div className="chart-info">
        <p>横軸に抽選回数、縦軸に数字を配置した履歴チャートです。各桁の数字の変化パターンを横スクロールで確認できます。</p>
      </div>
      
      <style jsx>{`
        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .chart-header h2 {
          margin: 0;
          color: #2d3748;
        }

        .granularity-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .granularity-controls label {
          font-weight: 500;
          color: #4a5568;
          font-size: 0.9rem;
        }

        .granularity-select {
          padding: 0.5rem 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          background: white;
          color: #4a5568;
          font-size: 0.9rem;
          cursor: pointer;
          transition: border-color 0.2s ease;
        }

        .granularity-select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .chart-container {
          overflow-x: auto;
          overflow-y: hidden;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: white;
          padding: 1rem;
        }

        .chart-wrapper {
          min-width: 800px;
        }

        .chart-info {
          margin-top: 1rem;
          padding: 1rem;
          background: rgba(102, 126, 234, 0.05);
          border-radius: 8px;
          color: #4a5568;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .chart-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .granularity-controls {
            align-self: stretch;
            justify-content: space-between;
          }
          
          .chart-container {
            padding: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}

export default LineChart;
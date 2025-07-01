import { useMemo } from 'react';
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
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null;

    // 最新100回分のデータを使用（逆順にして時系列順にする）
    const recentData = data.slice(0, 100).reverse();
    
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
  }, [data]);

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
        text: '当選番号の推移（最新100回）',
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
          text: '抽選回',
        },
        ticks: {
          maxTicksLimit: 10,
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: '数字',
        },
        min: 0,
        max: 9,
        ticks: {
          stepSize: 1,
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
      <h2>当選番号履歴チャート</h2>
      <div style={{ height: '500px', marginTop: '1rem' }}>
        <Line data={chartData} options={options} />
      </div>
      <div className="chart-info">
        <p>各桁の数字の変化を線グラフで表示しています。パターンや傾向を視覚的に確認できます。</p>
      </div>
      
      <style jsx>{`
        .chart-info {
          margin-top: 1rem;
          padding: 1rem;
          background: rgba(102, 126, 234, 0.05);
          border-radius: 8px;
          color: #4a5568;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}

export default LineChart;
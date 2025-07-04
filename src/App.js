import { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import DataViewer from './components/DataViewer';
import HeatMap from './components/HeatMap';
import LineChart from './components/LineChart';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
    fetchStats();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/numbers');
      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('データ取得エラー:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/numbers/stats');
      const result = await response.json();
      setStats(result);
    } catch (err) {
      console.error('統計データ取得エラー:', err);
    }
  };

  const handleScrape = async () => {
    setLoading(true);
    try {
      await fetch('http://localhost:3001/scrape', {
        method: 'POST'
      });
      await fetchData();
      await fetchStats();
    } catch (err) {
      console.error('スクレーピングエラー:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard data={data} stats={stats} onScrape={handleScrape} loading={loading} />;
      case 'chart':
        return <LineChart data={data} />;
      case 'heatmap':
        return <HeatMap stats={stats} />;
      case 'data':
        return <DataViewer />;
      default:
        return <Dashboard data={data} stats={stats} onScrape={handleScrape} loading={loading} />;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>ナンバーズ4 分析ツール</h1>
        <nav className="nav-tabs">
          <button 
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            ダッシュボード
          </button>
          <button 
            className={activeTab === 'chart' ? 'active' : ''}
            onClick={() => setActiveTab('chart')}
          >
            履歴チャート
          </button>
          <button 
            className={activeTab === 'heatmap' ? 'active' : ''}
            onClick={() => setActiveTab('heatmap')}
          >
            ヒートマップ
          </button>
          <button 
            className={activeTab === 'data' ? 'active' : ''}
            onClick={() => setActiveTab('data')}
          >
            データ検索
          </button>
        </nav>
      </header>
      <main className="app-main">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
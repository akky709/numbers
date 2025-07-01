import { useState } from 'react';
import './App.css';

function App() {

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleScrape = async () => {
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/scrape', {
        method: 'POST'
      });
      const data = await response.json();
      setResults(data.results || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button onClick={handleScrape} disabled={loading}>スクレーピング開始</button>

    
    </>
  );
}

export default App;

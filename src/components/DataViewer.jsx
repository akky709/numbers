import { useState, useEffect, useMemo } from 'react';

function DataViewer() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    number: '',
    startDate: '',
    endDate: '',
    limit: 100
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (isSearch = false) => {
    setLoading(true);
    try {
      let url = 'http://localhost:3001/api/numbers';
      
      if (isSearch) {
        const params = new URLSearchParams();
        if (searchParams.number) params.append('number', searchParams.number);
        if (searchParams.startDate) params.append('startDate', searchParams.startDate);
        if (searchParams.endDate) params.append('endDate', searchParams.endDate);
        params.append('limit', searchParams.limit);
        
        url = `http://localhost:3001/api/numbers/search?${params.toString()}`;
      }
      
      const response = await fetch(url);
      const result = await response.json();
      setData(result);
      setCurrentPage(1);
    } catch (err) {
      console.error('データ取得エラー:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData(true);
  };

  const handleReset = () => {
    setSearchParams({
      number: '',
      startDate: '',
      endDate: '',
      limit: 100
    });
    fetchData(false);
  };

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage]);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button key={1} onClick={() => handlePageChange(1)} className="pagination-btn">
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="ellipsis1" className="pagination-ellipsis">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="ellipsis2" className="pagination-ellipsis">...</span>);
      }
      pages.push(
        <button key={totalPages} onClick={() => handlePageChange(totalPages)} className="pagination-btn">
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="card">
      <h2>データ検索・閲覧</h2>
      
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-grid">
          <div className="form-group">
            <label htmlFor="number">当選番号</label>
            <input
              type="text"
              id="number"
              value={searchParams.number}
              onChange={(e) => setSearchParams({...searchParams, number: e.target.value})}
              placeholder="例: 1234 または 12"
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="startDate">開始日</label>
            <input
              type="date"
              id="startDate"
              value={searchParams.startDate}
              onChange={(e) => setSearchParams({...searchParams, startDate: e.target.value})}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="endDate">終了日</label>
            <input
              type="date"
              id="endDate"
              value={searchParams.endDate}
              onChange={(e) => setSearchParams({...searchParams, endDate: e.target.value})}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="limit">取得件数</label>
            <select
              id="limit"
              value={searchParams.limit}
              onChange={(e) => setSearchParams({...searchParams, limit: parseInt(e.target.value)})}
              className="form-input"
            >
              <option value={50}>50件</option>
              <option value={100}>100件</option>
              <option value={200}>200件</option>
              <option value={500}>500件</option>
            </select>
          </div>
        </div>
        
        <div className="search-buttons">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '検索中...' : '検索'}
          </button>
          <button type="button" onClick={handleReset} className="btn btn-secondary">
            リセット
          </button>
        </div>
      </form>

      <div className="data-info">
        <p>検索結果: {data.length}件</p>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>データを読み込み中...</p>
        </div>
      ) : (
        <>
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>回数</th>
                  <th>抽選日</th>
                  <th>当選番号</th>
                  <th>各桁</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item) => {
                  const digits = item.numbers.toString().padStart(4, '0').split('');
                  return (
                    <tr key={item.id}>
                      <td className="draw-number">第{item.id}回</td>
                      <td className="draw-date">{item.date}</td>
                      <td className="winning-number">{item.numbers}</td>
                      <td className="digits">
                        {digits.map((digit, index) => (
                          <span key={index} className="digit">{digit}</span>
                        ))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                前へ
              </button>
              
              {renderPagination()}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                次へ
              </button>
            </div>
          )}
        </>
      )}

      <style jsx>{`
        .search-form {
          background: rgba(102, 126, 234, 0.05);
          padding: 1.5rem;
          border-radius: 12px;
          margin-bottom: 2rem;
        }

        .search-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #4a5568;
          font-size: 0.9rem;
        }

        .form-input {
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 0.9rem;
          transition: border-color 0.2s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .search-buttons {
          display: flex;
          gap: 1rem;
        }

        .btn-secondary {
          background: #e2e8f0;
          color: #4a5568;
        }

        .btn-secondary:hover {
          background: #cbd5e0;
        }

        .data-info {
          margin-bottom: 1rem;
          color: #718096;
          font-size: 0.9rem;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 2rem;
          color: #718096;
        }

        .data-table-container {
          overflow-x: auto;
          margin-bottom: 2rem;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .data-table th {
          background: #f7fafc;
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: #4a5568;
          border-bottom: 1px solid #e2e8f0;
        }

        .data-table td {
          padding: 1rem;
          border-bottom: 1px solid #f7fafc;
        }

        .data-table tr:hover {
          background: rgba(102, 126, 234, 0.02);
        }

        .draw-number {
          font-weight: 600;
          color: #4a5568;
        }

        .draw-date {
          color: #718096;
        }

        .winning-number {
          font-size: 1.1rem;
          font-weight: 700;
          color: #667eea;
          font-family: 'Courier New', monospace;
          letter-spacing: 1px;
        }

        .digits {
          display: flex;
          gap: 0.5rem;
        }

        .digit {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background: rgba(102, 126, 234, 0.1);
          border-radius: 4px;
          font-weight: 600;
          font-family: 'Courier New', monospace;
          color: #667eea;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .pagination-btn {
          padding: 0.5rem 0.75rem;
          border: 1px solid #e2e8f0;
          background: white;
          color: #4a5568;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.9rem;
        }

        .pagination-btn:hover:not(:disabled) {
          background: #f7fafc;
          border-color: #cbd5e0;
        }

        .pagination-btn.active {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-ellipsis {
          padding: 0.5rem;
          color: #718096;
        }

        @media (max-width: 768px) {
          .search-grid {
            grid-template-columns: 1fr;
          }
          
          .search-buttons {
            flex-direction: column;
          }
          
          .data-table {
            font-size: 0.85rem;
          }
          
          .data-table th,
          .data-table td {
            padding: 0.75rem 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}

export default DataViewer;
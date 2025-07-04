import './QuickStats.css'

export default function QuickStats() {
  // サンプル統計データ
  const stats = {
    totalDraws: 6234,
    numbers3: {
      hotNumbers: ['7', '3', '9'],
      coldNumbers: ['0', '1', '4'],
      lastUpdate: '2025-01-15'
    },
    numbers4: {
      hotNumbers: ['7', '3', '9', '2'],
      coldNumbers: ['0', '1', '4', '6'],
      lastUpdate: '2025-01-15'
    }
  }

  return (
    <div className="quick-stats">
      <div className="grid grid-4 mb-8">
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.totalDraws.toLocaleString()}</h3>
            <p className="stat-label">総抽選回数</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3 className="stat-number">2</h3>
            <p className="stat-label">分析対象ゲーム</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <h3 className="stat-number">10</h3>
            <p className="stat-label">ホット数字</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">❄️</div>
          <div className="stat-content">
            <h3 className="stat-number">10</h3>
            <p className="stat-label">コールド数字</p>
          </div>
        </div>
      </div>

      <div className="grid grid-2">
        {/* ナンバーズ3統計 */}
        <div className="card">
          <div className="card-header">
            <h3>ナンバーズ3 - ホット＆コールド</h3>
            <span className="update-time">更新: {stats.numbers3.lastUpdate}</span>
          </div>
          <div className="card-content">
            <div className="hot-cold-section">
              <div className="hot-section">
                <h4 className="section-title hot">🔥 ホット数字</h4>
                <div className="number-list">
                  {stats.numbers3.hotNumbers.map((number, index) => (
                    <span key={index} className="number-tag hot">{number}</span>
                  ))}
                </div>
                <p className="section-description">よく出現する数字</p>
              </div>
              
              <div className="cold-section">
                <h4 className="section-title cold">❄️ コールド数字</h4>
                <div className="number-list">
                  {stats.numbers3.coldNumbers.map((number, index) => (
                    <span key={index} className="number-tag cold">{number}</span>
                  ))}
                </div>
                <p className="section-description">出現頻度が低い数字</p>
              </div>
            </div>
          </div>
        </div>

        {/* ナンバーズ4統計 */}
        <div className="card">
          <div className="card-header">
            <h3>ナンバーズ4 - ホット＆コールド</h3>
            <span className="update-time">更新: {stats.numbers4.lastUpdate}</span>
          </div>
          <div className="card-content">
            <div className="hot-cold-section">
              <div className="hot-section">
                <h4 className="section-title hot">🔥 ホット数字</h4>
                <div className="number-list">
                  {stats.numbers4.hotNumbers.map((number, index) => (
                    <span key={index} className="number-tag hot">{number}</span>
                  ))}
                </div>
                <p className="section-description">よく出現する数字</p>
              </div>
              
              <div className="cold-section">
                <h4 className="section-title cold">❄️ コールド数字</h4>
                <div className="number-list">
                  {stats.numbers4.coldNumbers.map((number, index) => (
                    <span key={index} className="number-tag cold">{number}</span>
                  ))}
                </div>
                <p className="section-description">出現頻度が低い数字</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
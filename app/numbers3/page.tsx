'use client'

import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './analysis.css'

interface Numbers3Data {
  id: number
  date: string
  numbers: string
}

interface FrequencyData {
  [key: string]: number
}

interface PositionFrequency {
  position1: FrequencyData
  position2: FrequencyData
  position3: FrequencyData
}

export default function Numbers3Page() {
  const [historyData, setHistoryData] = useState<Numbers3Data[]>([])
  const [frequencyData, setFrequencyData] = useState<FrequencyData>({})
  const [positionFrequency, setPositionFrequency] = useState<PositionFrequency>({
    position1: {},
    position2: {},
    position3: {}
  })
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'recent' | 'all'>('recent')
  const [selectedPeriod, setSelectedPeriod] = useState<number>(50)

  useEffect(() => {
    fetchData()
  }, [selectedPeriod])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/numbers3/history?limit=${selectedPeriod}`)
      if (response.ok) {
        const data = await response.json()
        setHistoryData(data)
        analyzeData(data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const analyzeData = (data: Numbers3Data[]) => {
    const frequency: FrequencyData = {}
    const posFreq: PositionFrequency = {
      position1: {},
      position2: {},
      position3: {}
    }

    data.forEach(item => {
      const digits = item.numbers.split('')
      
      // 全体の頻度
      digits.forEach(digit => {
        frequency[digit] = (frequency[digit] || 0) + 1
      })

      // 位置別頻度
      if (digits[0]) posFreq.position1[digits[0]] = (posFreq.position1[digits[0]] || 0) + 1
      if (digits[1]) posFreq.position2[digits[1]] = (posFreq.position2[digits[1]] || 0) + 1
      if (digits[2]) posFreq.position3[digits[2]] = (posFreq.position3[digits[2]] || 0) + 1
    })

    setFrequencyData(frequency)
    setPositionFrequency(posFreq)
  }

  const getTopNumbers = (freq: FrequencyData, count: number = 5) => {
    return Object.entries(freq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, count)
  }

  const getBottomNumbers = (freq: FrequencyData, count: number = 5) => {
    return Object.entries(freq)
      .sort(([,a], [,b]) => a - b)
      .slice(0, count)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  const getFrequencyColor = (frequency: number, maxFreq: number) => {
    const intensity = frequency / maxFreq
    if (intensity > 0.8) return '#e53e3e'
    if (intensity > 0.6) return '#fd7f28'
    if (intensity > 0.4) return '#fbb040'
    if (intensity > 0.2) return '#68d391'
    return '#4299e1'
  }

  const maxFrequency = Math.max(...Object.values(frequencyData))

  if (loading) {
    return (
      <div className="app">
        <Header />
        <main className="main-content">
          <div className="container analysis-container">
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>データを分析中...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="container analysis-container">
          {/* ヘッダーセクション */}
          <div className="analysis-header">
            <h1 className="analysis-title">
              <span className="title-icon">🎯</span>
              ナンバーズ3 詳細分析
            </h1>
            <p className="analysis-subtitle">
              過去{selectedPeriod}回のデータから導き出される数字の傾向と特徴
            </p>
          </div>

          {/* コントロールパネル */}
          <div className="control-panel">
            <div className="period-selector">
              <label>分析期間:</label>
              <div className="period-buttons">
                {[20, 50, 100, 200].map(period => (
                  <button
                    key={period}
                    className={`period-btn ${selectedPeriod === period ? 'active' : ''}`}
                    onClick={() => setSelectedPeriod(period)}
                  >
                    {period}回
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 統計概要 */}
          <div className="stats-overview">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h3>{historyData.length}</h3>
                <p>分析対象回数</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🔥</div>
              <div className="stat-content">
                <h3>{getTopNumbers(frequencyData, 1)[0]?.[0] || '-'}</h3>
                <p>最頻出数字</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">❄️</div>
              <div className="stat-content">
                <h3>{getBottomNumbers(frequencyData, 1)[0]?.[0] || '-'}</h3>
                <p>最低頻度数字</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📈</div>
              <div className="stat-content">
                <h3>{maxFrequency}</h3>
                <p>最大出現回数</p>
              </div>
            </div>
          </div>

          {/* メイン分析エリア */}
          <div className="analysis-grid">
            {/* 全体頻度分析 */}
            <div className="analysis-card">
              <div className="card-header">
                <h3>🎲 数字別出現頻度</h3>
                <span className="data-count">過去{selectedPeriod}回</span>
              </div>
              <div className="card-content">
                <div className="frequency-chart">
                  {[0,1,2,3,4,5,6,7,8,9].map(num => {
                    const freq = frequencyData[num.toString()] || 0
                    const percentage = maxFrequency > 0 ? (freq / maxFrequency) * 100 : 0
                    return (
                      <div key={num} className="frequency-bar">
                        <div className="bar-container">
                          <div 
                            className="bar-fill"
                            style={{ 
                              height: `${percentage}%`,
                              backgroundColor: getFrequencyColor(freq, maxFrequency)
                            }}
                          ></div>
                        </div>
                        <div className="bar-number">{num}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* 合計数分析 */}
            <div className="analysis-card">
              <div className="card-header">
                <h3>📊 合計数別出現頻度</h3>
                <span className="data-count">0〜27の範囲</span>
              </div>
              <div className="card-content">
                <div className="sum-chart">
                  {Array.from({ length: 28 }, (_, i) => i).map(sum => {
                    const freq = sumFrequency[sum.toString()] || 0
                    const percentage = maxSumFrequency > 0 ? (freq / maxSumFrequency) * 100 : 0
                    return (
                      <div key={sum} className="sum-bar">
                        <div className="sum-bar-container">
                          <div 
                            className="sum-bar-fill"
                            style={{ 
                              height: `${percentage}%`,
                              backgroundColor: getFrequencyColor(freq, maxSumFrequency)
                            }}
                          ></div>
                        </div>
                        <div className="sum-bar-number">{sum}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* 位置別分析 */}
            <div className="analysis-card">
              <div className="card-header">
                <h3>📍 位置別出現傾向</h3>
                <span className="data-count">各桁の特徴</span>
              </div>
              <div className="card-content">
                <div className="position-analysis">
                  {[
                    { title: '百の位', data: positionFrequency.position1, color: '#667eea' },
                    { title: '十の位', data: positionFrequency.position2, color: '#764ba2' },
                    { title: '一の位', data: positionFrequency.position3, color: '#f093fb' }
                  ].map((position, index) => (
                    <div key={index} className="position-section">
                      <h4 style={{ color: position.color }}>{position.title}</h4>
                      <div className="position-numbers">
                        {getTopNumbers(position.data, 3).map(([num, freq]) => (
                          <div key={num} className="position-number" style={{ borderColor: position.color }}>
                            <span className="number">{num}</span>
                            <span className="frequency">{freq}回</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ホット・コールド分析 */}
            <div className="analysis-card">
              <div className="card-header">
                <h3>🌡️ ホット・コールド分析</h3>
                <span className="data-count">出現傾向</span>
              </div>
              <div className="card-content">
                <div className="hot-cold-analysis">
                  <div className="hot-section">
                    <h4 className="section-title hot">🔥 ホット数字</h4>
                    <div className="number-grid">
                      {getTopNumbers(frequencyData, 5).map(([num, freq]) => (
                        <div key={num} className="number-item hot">
                          <span className="number">{num}</span>
                          <span className="frequency">{freq}回</span>
                          <div className="percentage">
                            {((freq / (selectedPeriod * 3)) * 100).toFixed(1)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="cold-section">
                    <h4 className="section-title cold">❄️ コールド数字</h4>
                    <div className="number-grid">
                      {getBottomNumbers(frequencyData, 5).map(([num, freq]) => (
                        <div key={num} className="number-item cold">
                          <span className="number">{num}</span>
                          <span className="frequency">{freq}回</span>
                          <div className="percentage">
                            {((freq / (selectedPeriod * 3)) * 100).toFixed(1)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 最近の当選履歴 */}
            <div className="analysis-card full-width">
              <div className="card-header">
                <h3>📋 最近の当選履歴</h3>
                <span className="data-count">最新{Math.min(20, historyData.length)}件</span>
              </div>
              <div className="card-content">
                <div className="history-table">
                  <div className="table-header">
                    <span>抽選日</span>
                    <span>当選番号</span>
                    <span>百の位</span>
                    <span>十の位</span>
                    <span>一の位</span>
                    <span>合計</span>
                  </div>
                  {historyData.slice(0, 20).map((item, index) => {
                    const digits = item.numbers.split('')
                    const sum = digits.reduce((acc, digit) => acc + parseInt(digit), 0)
                    return (
                      <div key={item.id} className="table-row">
                        <span className="date">{formatDate(item.date)}</span>
                        <div className="winning-numbers">
                          {digits.map((digit, i) => (
                            <span key={i} className="number-ball small">{digit}</span>
                          ))}
                        </div>
                        <span className="digit-cell">{digits[0]}</span>
                        <span className="digit-cell">{digits[1]}</span>
                        <span className="digit-cell">{digits[2]}</span>
                        <span className="digit-cell" style={{ fontWeight: '700', color: '#667eea' }}>{sum}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
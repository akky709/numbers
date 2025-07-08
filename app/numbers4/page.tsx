'use client'

import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './analysis.css'

interface Numbers4Data {
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
  position4: FrequencyData
}

export default function Numbers4Page() {
  const [historyData, setHistoryData] = useState<Numbers4Data[]>([])
  const [frequencyData, setFrequencyData] = useState<FrequencyData>({})
  const [sumFrequency, setSumFrequency] = useState<FrequencyData>({})
  const [positionFrequency, setPositionFrequency] = useState<PositionFrequency>({
    position1: {},
    position2: {},
    position3: {},
    position4: {}
  })
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<number>(50)
  const [patternFilter, setPatternFilter] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [selectedPeriod])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/numbers4/history?limit=${selectedPeriod}`)
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

  const analyzeData = (data: Numbers4Data[]) => {
    const frequency: FrequencyData = {}
    const sumFreq: FrequencyData = {}
    const posFreq: PositionFrequency = {
      position1: {},
      position2: {},
      position3: {},
      position4: {}
    }

    data.forEach(item => {
      const digits = item.numbers.split('')
      
      // 全体の頻度
      digits.forEach(digit => {
        frequency[digit] = (frequency[digit] || 0) + 1
      })

      // 合計数の頻度
      const sum = digits.reduce((acc, digit) => acc + parseInt(digit), 0)
      sumFreq[sum.toString()] = (sumFreq[sum.toString()] || 0) + 1

      // 位置別頻度
      if (digits[0]) posFreq.position1[digits[0]] = (posFreq.position1[digits[0]] || 0) + 1
      if (digits[1]) posFreq.position2[digits[1]] = (posFreq.position2[digits[1]] || 0) + 1
      if (digits[2]) posFreq.position3[digits[2]] = (posFreq.position3[digits[2]] || 0) + 1
      if (digits[3]) posFreq.position4[digits[3]] = (posFreq.position4[digits[3]] || 0) + 1
    })

    setFrequencyData(frequency)
    setSumFrequency(sumFreq)
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

  // パターン判定関数
  const getPattern = (numbers: string) => {
    const digits = numbers.split('')
    const digitCounts = digits.reduce((acc, digit) => {
      acc[digit] = (acc[digit] || 0) + 1
      return acc
    }, {} as { [key: string]: number })
    
    const counts = Object.values(digitCounts).sort((a, b) => b - a)
    
    if (counts[0] === 4) return 'force'
    if (counts[0] === 3) return 'triple'
    if (counts[0] === 2) return 'double'
    return null
  }

  // パターンでフィルターされたデータ
  const filteredHistoryData = patternFilter 
    ? historyData.filter(item => getPattern(item.numbers) === patternFilter)
    : historyData

  // パターン別カウント
  const patternCounts = {
    force: historyData.filter(item => getPattern(item.numbers) === 'force').length,
    triple: historyData.filter(item => getPattern(item.numbers) === 'triple').length,
    double: historyData.filter(item => getPattern(item.numbers) === 'double').length
  }

  const maxFrequency = Math.max(...Object.values(frequencyData))
  const maxSumFrequency = Math.max(...Object.values(sumFrequency), 1)

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
              ナンバーズ4 詳細分析
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
                <span className="data-count">0〜36の範囲</span>
              </div>
              <div className="card-content">
                <div className="sum-chart">
                  {Array.from({ length: 37 }, (_, i) => i).map(sum => {
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
                    { title: '千の位', data: positionFrequency.position1, color: '#667eea' },
                    { title: '百の位', data: positionFrequency.position2, color: '#764ba2' },
                    { title: '十の位', data: positionFrequency.position3, color: '#f093fb' },
                    { title: '一の位', data: positionFrequency.position4, color: '#f6d365' }
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
                            {((freq / (selectedPeriod * 4)) * 100).toFixed(1)}%
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
                            {((freq / (selectedPeriod * 4)) * 100).toFixed(1)}%
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
                <span className="data-count">
                  {patternFilter ? `${patternFilter}パターン: ${filteredHistoryData.length}件` : `最新${Math.min(20, historyData.length)}件`}
                </span>
              </div>
              <div className="card-content">
                {/* パターンフィルター */}
                <div className="pattern-filters">
                  <button
                    className={`filter-btn ${patternFilter === null ? 'active' : ''}`}
                    onClick={() => setPatternFilter(null)}
                  >
                    すべて
                    <span className="count">{historyData.length}</span>
                  </button>
                  <button
                    className={`filter-btn ${patternFilter === 'force' ? 'active' : ''}`}
                    onClick={() => setPatternFilter('force')}
                  >
                    🚀 フォース
                    <span className="count">{patternCounts.force}</span>
                  </button>
                  <button
                    className={`filter-btn ${patternFilter === 'triple' ? 'active' : ''}`}
                    onClick={() => setPatternFilter('triple')}
                  >
                    🎯 トリプル
                    <span className="count">{patternCounts.triple}</span>
                  </button>
                  <button
                    className={`filter-btn ${patternFilter === 'double' ? 'active' : ''}`}
                    onClick={() => setPatternFilter('double')}
                  >
                    🎲 ダブル
                    <span className="count">{patternCounts.double}</span>
                  </button>
                  {patternFilter && (
                    <button
                      className="filter-btn clear-filter"
                      onClick={() => setPatternFilter(null)}
                    >
                      ✕ クリア
                    </button>
                  )}
                </div>
                
                <div className="history-table">
                  <div className="table-header">
                    <span>抽選日</span>
                    <span>当選番号</span>
                    <span>千の位</span>
                    <span>百の位</span>
                    <span>十の位</span>
                    <span>一の位</span>
                    <span>合計</span>
                  </div>
                  {filteredHistoryData.slice(0, 20).map((item, index) => {
                    const digits = item.numbers.split('')
                    const sum = digits.reduce((acc, digit) => acc + parseInt(digit), 0)
                    const pattern = getPattern(item.numbers)
                    return (
                      <div key={item.id} className="table-row">
                        <span className="date">{formatDate(item.date)}</span>
                        <div className="winning-numbers" style={{ display: 'flex', alignItems: 'center' }}>
                          {digits.map((digit, i) => (
                            <span key={i} className="number-ball small">{digit}</span>
                          ))}
                          {pattern && (
                            <span className={`pattern-indicator ${pattern}`}>
                              {pattern === 'force' ? 'フォース' : pattern === 'triple' ? 'トリプル' : 'ダブル'}
                            </span>
                          )}
                        </div>
                        <span className="digit-cell">{digits[0]}</span>
                        <span className="digit-cell">{digits[1]}</span>
                        <span className="digit-cell">{digits[2]}</span>
                        <span className="digit-cell">{digits[3]}</span>
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
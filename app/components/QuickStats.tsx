'use client'

import { useState, useEffect } from 'react'
import './QuickStats.css'

interface FrequencyData {
  numbers3: { [key: string]: number }
  numbers4: { [key: string]: number }
}

export default function QuickStats() {
  const [frequencyData, setFrequencyData] = useState<FrequencyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFrequencyData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/stats/frequency')
        
        if (response.ok) {
          const data = await response.json()
          setFrequencyData(data)
        } else {
          setError('統計データの取得に失敗しました')
        }
      } catch (err) {
        setError('統計データの取得に失敗しました')
        console.error('Error fetching frequency data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFrequencyData()
  }, [])

  const getHotNumbers = (frequency: { [key: string]: number }, count: number = 3) => {
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, count)
      .map(([number]) => number)
  }

  const getColdNumbers = (frequency: { [key: string]: number }, count: number = 3) => {
    return Object.entries(frequency)
      .sort(([,a], [,b]) => a - b)
      .slice(0, count)
      .map(([number]) => number)
  }


  if (loading) {
    return (
      <div className="quick-stats">
        <div className="text-center">
          <p>統計データを読み込み中...</p>
        </div>
      </div>
    )
  }

  if (error || !frequencyData) {
    return (
      <div className="quick-stats">
        <div className="text-center">
          <p style={{ color: '#e53e3e' }}>{error || '統計データがありません'}</p>
        </div>
      </div>
    )
  }

  const numbers3Hot = getHotNumbers(frequencyData.numbers3, 3)
  const numbers3Cold = getColdNumbers(frequencyData.numbers3, 3)
  const numbers4Hot = getHotNumbers(frequencyData.numbers4, 4)
  const numbers4Cold = getColdNumbers(frequencyData.numbers4, 4)

  const currentDate = new Date().toISOString().split('T')[0]

  return (
    <div className="quick-stats">
      <div className="grid grid-2">
        {/* ナンバーズ3統計 */}
        <div className="card">
          <div className="card-header">
            <h3>ナンバーズ3 - ホット＆コールド</h3>
            <span className="update-time">更新: {currentDate}</span>
          </div>
          <div className="card-content">
            <div className="hot-cold-section">
              <div className="hot-section">
                <h4 className="section-title hot">🔥 ホット数字</h4>
                <div className="number-list">
                  {numbers3Hot.map((number, index) => (
                    <span key={index} className="number-tag hot">{number}</span>
                  ))}
                </div>
                <p className="section-description">よく出現する数字</p>
              </div>
              
              <div className="cold-section">
                <h4 className="section-title cold">❄️ コールド数字</h4>
                <div className="number-list">
                  {numbers3Cold.map((number, index) => (
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
            <span className="update-time">更新: {currentDate}</span>
          </div>
          <div className="card-content">
            <div className="hot-cold-section">
              <div className="hot-section">
                <h4 className="section-title hot">🔥 ホット数字</h4>
                <div className="number-list">
                  {numbers4Hot.map((number, index) => (
                    <span key={index} className="number-tag hot">{number}</span>
                  ))}
                </div>
                <p className="section-description">よく出現する数字</p>
              </div>
              
              <div className="cold-section">
                <h4 className="section-title cold">❄️ コールド数字</h4>
                <div className="number-list">
                  {numbers4Cold.map((number, index) => (
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
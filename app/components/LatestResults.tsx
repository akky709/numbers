'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import './LatestResults.css'

interface Numbers3Data {
  id: number
  date: string
  numbers: string
}

interface Numbers4Data {
  id: number
  date: string
  numbers: string
}

export default function LatestResults() {
  const [latestNumbers3, setLatestNumbers3] = useState<Numbers3Data | null>(null)
  const [latestNumbers4, setLatestNumbers4] = useState<Numbers4Data | null>(null)
  const [recentNumbers3, setRecentNumbers3] = useState<Numbers3Data[]>([])
  const [recentNumbers4, setRecentNumbers4] = useState<Numbers4Data[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // 最新データを取得
        const [latest3Response, latest4Response, history3Response, history4Response] = await Promise.all([
          fetch('/api/numbers3/latest'),
          fetch('/api/numbers4/latest'),
          fetch('/api/numbers3/history?limit=5'),
          fetch('/api/numbers4/history?limit=5')
        ])

        if (latest3Response.ok) {
          const latest3 = await latest3Response.json()
          setLatestNumbers3(latest3)
        } else {
          console.error('Failed to fetch latest Numbers3:', latest3Response.status)
        }

        if (latest4Response.ok) {
          const latest4 = await latest4Response.json()
          setLatestNumbers4(latest4)
        } else {
          console.error('Failed to fetch latest Numbers4:', latest4Response.status)
        }

        if (history3Response.ok) {
          const history3 = await history3Response.json()
          console.log('Numbers3 history data:', history3)
          setRecentNumbers3(history3)
        } else {
          console.error('Failed to fetch Numbers3 history:', history3Response.status)
        }

        if (history4Response.ok) {
          const history4 = await history4Response.json()
          console.log('Numbers4 history data:', history4)
          setRecentNumbers4(history4)
        } else {
          console.error('Failed to fetch Numbers4 history:', history4Response.status)
        }

      } catch (err) {
        setError('データの取得に失敗しました')
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  const formatDateFull = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
  }

  if (loading) {
    return (
      <div className="latest-results">
        <div className="text-center">
          <p>データを読み込み中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="latest-results">
        <div className="text-center">
          <p style={{ color: '#e53e3e' }}>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="latest-results">
      <div className="grid grid-2 mb-8">
        {/* ナンバーズ3最新結果 */}
        {latestNumbers3 ? (
          <div className="card result-card">
            <div className="card-header">
              <h3 className="result-title">ナンバーズ3</h3>
              <span className="draw-info">ID: {latestNumbers3.id}</span>
            </div>
            <div className="card-content">
              <div className="winning-numbers">
                {latestNumbers3.numbers.split('').map((digit, index) => (
                  <span key={index} className="number-ball">{digit}</span>
                ))}
              </div>
              <div className="result-details">
                <span className="draw-date">{formatDateFull(latestNumbers3.date)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="card result-card">
            <div className="card-content">
              <p>ナンバーズ3のデータがありません</p>
            </div>
          </div>
        )}

        {/* ナンバーズ4最新結果 */}
        {latestNumbers4 ? (
          <div className="card result-card">
            <div className="card-header">
              <h3 className="result-title">ナンバーズ4</h3>
              <span className="draw-info">ID: {latestNumbers4.id}</span>
            </div>
            <div className="card-content">
              <div className="winning-numbers">
                {latestNumbers4.numbers.split('').map((digit, index) => (
                  <span key={index} className="number-ball">{digit}</span>
                ))}
              </div>
              <div className="result-details">
                <span className="draw-date">{formatDateFull(latestNumbers4.date)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="card result-card">
            <div className="card-content">
              <p>ナンバーズ4のデータがありません</p>
            </div>
          </div>
        )}
      </div>

      {/* 過去の結果 */}
      <div className="card">
        <div className="card-header">
          <h3>過去の当選番号</h3>
        </div>
        <div className="card-content">
          <div className="recent-results-table">
            <div className="table-header">
              <span>抽選日</span>
              <span>ナンバーズ3</span>
              <span>ナンバーズ4</span>
            </div>
            {Math.max(recentNumbers3.length, recentNumbers4.length) > 0 ? (
              Array.from({ length: Math.min(Math.max(recentNumbers3.length, recentNumbers4.length), 5) }).map((_, index) => {
                const numbers3Item = recentNumbers3[index]
                const numbers4Item = recentNumbers4[index]
                const displayDate = numbers3Item?.date || numbers4Item?.date || ''
                
                return (
                  <div key={index} className="table-row">
                    <span className="date">{displayDate ? formatDate(displayDate) : '-'}</span>
                    <div className="numbers">
                      {numbers3Item ? numbers3Item.numbers.split('').map((digit, i) => (
                        <span key={i} className="mini-ball">{digit}</span>
                      )) : <span style={{ color: '#718096', fontSize: '12px' }}>データなし</span>}
                    </div>
                    <div className="numbers">
                      {numbers4Item ? numbers4Item.numbers.split('').map((digit, i) => (
                        <span key={i} className="mini-ball">{digit}</span>
                      )) : <span style={{ color: '#718096', fontSize: '12px' }}>データなし</span>}
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="table-row">
                <span className="date" style={{ color: '#718096' }}>データがありません</span>
                <div className="numbers">
                  <span style={{ color: '#718096', fontSize: '12px' }}>データなし</span>
                </div>
                <div className="numbers">
                  <span style={{ color: '#718096', fontSize: '12px' }}>データなし</span>
                </div>
              </div>
            )}
          </div>
          <div className="card-footer">
            <Link href="/numbers4" className="btn btn-outline">
              過去の当選番号をもっと見る
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
import mysql from 'mysql2/promise'

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

// データベース接続プールを作成
const pool = mysql.createPool(dbConfig)

export default pool

// 型定義（指定されたカラム構造に合わせて更新）
export interface Numbers3Result {
  id: number
  date: string
  numbers: string
}

export interface Numbers4Result {
  id: number
  date: string
  numbers: string
}

// ナンバーズ3の最新結果を取得
export async function getLatestNumbers3(): Promise<Numbers3Result | null> {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM numbers3 ORDER BY date DESC, id DESC LIMIT 1'
    )
    const results = rows as Numbers3Result[]
    return results.length > 0 ? results[0] : null
  } catch (error) {
    console.error('Error fetching latest Numbers3:', error)
    return null
  }
}

// ナンバーズ4の最新結果を取得
export async function getLatestNumbers4(): Promise<Numbers4Result | null> {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM numbers4 ORDER BY date DESC, id DESC LIMIT 1'
    )
    const results = rows as Numbers4Result[]
    return results.length > 0 ? results[0] : null
  } catch (error) {
    console.error('Error fetching latest Numbers4:', error)
    return null
  }
}

// ナンバーズ3の過去の結果を取得
export async function getNumbers3History(limit: number = 100): Promise<Numbers3Result[]> {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM numbers3 ORDER BY date DESC, id DESC LIMIT ?',
      [limit]
    )
    return rows as Numbers3Result[]
  } catch (error) {
    console.error('Error fetching Numbers3 history:', error)
    return []
  }
}

// ナンバーズ4の過去の結果を取得
export async function getNumbers4History(limit: number = 100): Promise<Numbers4Result[]> {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM numbers4 ORDER BY date DESC, id DESC LIMIT ?',
      [limit]
    )
    return rows as Numbers4Result[]
  } catch (error) {
    console.error('Error fetching Numbers4 history:', error)
    return []
  }
}

// 数字の出現頻度を分析
export async function analyzeNumbers3Frequency(): Promise<{ [key: string]: number }> {
  try {
    const [rows] = await pool.execute(
      'SELECT numbers FROM numbers3'
    )
    const results = rows as { numbers: string }[]
    
    const frequency: { [key: string]: number } = {}
    
    results.forEach(result => {
      const digits = result.numbers.split('')
      digits.forEach(digit => {
        frequency[digit] = (frequency[digit] || 0) + 1
      })
    })
    
    return frequency
  } catch (error) {
    console.error('Error analyzing Numbers3 frequency:', error)
    return {}
  }
}

// ナンバーズ4の数字出現頻度を分析
export async function analyzeNumbers4Frequency(): Promise<{ [key: string]: number }> {
  try {
    const [rows] = await pool.execute(
      'SELECT numbers FROM numbers4'
    )
    const results = rows as { numbers: string }[]
    
    const frequency: { [key: string]: number } = {}
    
    results.forEach(result => {
      const digits = result.numbers.split('')
      digits.forEach(digit => {
        frequency[digit] = (frequency[digit] || 0) + 1
      })
    })
    
    return frequency
  } catch (error) {
    console.error('Error analyzing Numbers4 frequency:', error)
    return {}
  }
}

// データベース接続テスト関数
export async function testConnection(): Promise<boolean> {
  try {
    const connection = await pool.getConnection()
    await connection.ping()
    connection.release()
    console.log('Database connection successful')
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}
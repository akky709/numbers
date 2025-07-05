import { NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET() {
  try {
    // データベース接続テスト
    const connection = await pool.getConnection()
    console.log('Database connection successful')
    
    // テーブル存在確認
    const [tables] = await connection.execute(
      "SHOW TABLES LIKE 'numbers%'"
    )
    console.log('Available tables:', tables)
    
    // numbers3テーブルの構造確認
    try {
      const [numbers3Structure] = await connection.execute(
        "DESCRIBE numbers3"
      )
      console.log('Numbers3 table structure:', numbers3Structure)
    } catch (error) {
      console.log('Numbers3 table does not exist or error:', error)
    }
    
    // numbers4テーブルの構造確認
    try {
      const [numbers4Structure] = await connection.execute(
        "DESCRIBE numbers4"
      )
      console.log('Numbers4 table structure:', numbers4Structure)
    } catch (error) {
      console.log('Numbers4 table does not exist or error:', error)
    }
    
    // numbers3のデータ件数確認
    try {
      const [numbers3Count] = await connection.execute(
        "SELECT COUNT(*) as count FROM numbers3"
      )
      console.log('Numbers3 count:', numbers3Count)
    } catch (error) {
      console.log('Error counting numbers3:', error)
    }
    
    // numbers4のデータ件数確認
    try {
      const [numbers4Count] = await connection.execute(
        "SELECT COUNT(*) as count FROM numbers4"
      )
      console.log('Numbers4 count:', numbers4Count)
    } catch (error) {
      console.log('Error counting numbers4:', error)
    }
    
    // 実際のデータサンプル取得
    try {
      const [numbers3Sample] = await connection.execute(
        "SELECT * FROM numbers3 LIMIT 3"
      )
      console.log('Numbers3 sample data:', numbers3Sample)
    } catch (error) {
      console.log('Error getting numbers3 sample:', error)
    }
    
    try {
      const [numbers4Sample] = await connection.execute(
        "SELECT * FROM numbers4 LIMIT 3"
      )
      console.log('Numbers4 sample data:', numbers4Sample)
    } catch (error) {
      console.log('Error getting numbers4 sample:', error)
    }
    
    connection.release()
    
    return NextResponse.json({
      status: 'success',
      message: 'Database debug completed. Check server console for details.',
      tables,
    })
    
  } catch (error) {
    console.error('Database debug error:', error)
    return NextResponse.json(
      { 
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error
      },
      { status: 500 }
    )
  }
}
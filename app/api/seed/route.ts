import { NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function POST() {
  try {
    const connection = await pool.getConnection()
    
    // テーブルが存在しない場合は作成
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS numbers3 (
        id INT AUTO_INCREMENT PRIMARY KEY,
        date DATE NOT NULL,
        numbers VARCHAR(3) NOT NULL
      )
    `)
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS numbers4 (
        id INT AUTO_INCREMENT PRIMARY KEY,
        date DATE NOT NULL,
        numbers VARCHAR(4) NOT NULL
      )
    `)
    
    // 既存データを削除（テスト用）
    await connection.execute('DELETE FROM numbers3')
    await connection.execute('DELETE FROM numbers4')
    
    // テストデータを挿入
    const numbers3Data = [
      ['2025-01-15', '739'],
      ['2025-01-14', '582'],
      ['2025-01-13', '194'],
      ['2025-01-12', '367'],
      ['2025-01-11', '428'],
      ['2025-01-10', '051'],
      ['2025-01-09', '926'],
      ['2025-01-08', '473'],
      ['2025-01-07', '815'],
      ['2025-01-06', '290']
    ]
    
    const numbers4Data = [
      ['2025-01-15', '7392'],
      ['2025-01-14', '5821'],
      ['2025-01-13', '1947'],
      ['2025-01-12', '3675'],
      ['2025-01-11', '4289'],
      ['2025-01-10', '0516'],
      ['2025-01-09', '9264'],
      ['2025-01-08', '4738'],
      ['2025-01-07', '8157'],
      ['2025-01-06', '2903']
    ]
    
    // numbers3データ挿入
    for (const [date, numbers] of numbers3Data) {
      await connection.execute(
        'INSERT INTO numbers3 (date, numbers) VALUES (?, ?)',
        [date, numbers]
      )
    }
    
    // numbers4データ挿入
    for (const [date, numbers] of numbers4Data) {
      await connection.execute(
        'INSERT INTO numbers4 (date, numbers) VALUES (?, ?)',
        [date, numbers]
      )
    }
    
    // 挿入結果確認
    const [numbers3Count] = await connection.execute(
      'SELECT COUNT(*) as count FROM numbers3'
    )
    const [numbers4Count] = await connection.execute(
      'SELECT COUNT(*) as count FROM numbers4'
    )
    
    connection.release()
    
    return NextResponse.json({
      status: 'success',
      message: 'Test data inserted successfully',
      numbers3Count,
      numbers4Count
    })
    
  } catch (error) {
    console.error('Seed data error:', error)
    return NextResponse.json(
      { 
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
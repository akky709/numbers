import { NextResponse } from 'next/server'
import { analyzeNumbers3RecentFrequency, analyzeNumbers4RecentFrequency } from '@/lib/database'

export async function GET() {
  try {
    const [numbers3RecentFreq, numbers4RecentFreq] = await Promise.all([
      analyzeNumbers3RecentFrequency(),
      analyzeNumbers4RecentFrequency()
    ])
    
    return NextResponse.json({
      numbers3: numbers3RecentFreq,
      numbers4: numbers4RecentFreq
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
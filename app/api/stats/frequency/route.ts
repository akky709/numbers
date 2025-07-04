import { NextResponse } from 'next/server'
import { analyzeNumbers3Frequency, analyzeNumbers4Frequency } from '@/lib/database'

export async function GET() {
  try {
    const [numbers3Freq, numbers4Freq] = await Promise.all([
      analyzeNumbers3Frequency(),
      analyzeNumbers4Frequency()
    ])
    
    return NextResponse.json({
      numbers3: numbers3Freq,
      numbers4: numbers4Freq
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
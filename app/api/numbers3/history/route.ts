import { NextResponse } from 'next/server'
import { getNumbers3History } from '@/lib/database'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '100')
    
    console.log('Fetching Numbers3 history with limit:', limit)
    const history = await getNumbers3History(limit)
    console.log('Numbers3 history result:', history)
    
    return NextResponse.json(history)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
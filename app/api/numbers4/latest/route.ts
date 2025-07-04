import { NextResponse } from 'next/server'
import { getLatestNumbers4 } from '@/lib/database'

export async function GET() {
  try {
    const latest = await getLatestNumbers4()
    
    if (!latest) {
      return NextResponse.json(
        { error: 'No data found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(latest)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
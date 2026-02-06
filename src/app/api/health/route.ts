import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    
    // Perform a simple operation to check DB connectivity
    await payload.find({
      collection: 'users',
      limit: 1,
    })

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
    }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
    }, { status: 500 })
  }
}

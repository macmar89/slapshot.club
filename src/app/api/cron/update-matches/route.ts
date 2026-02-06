import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { updateScheduledMatches } from '@/features/matches/services/matchService'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  // 1. Verify Authentication
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  const payload = await getPayload({ config })

  try {
    const result = await updateScheduledMatches(payload)
    
    return NextResponse.json(result)
  } catch (error) {
    payload.logger.error({ err: error }, '[CRON] Error updating matches via API')
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

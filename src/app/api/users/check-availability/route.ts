import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { headers } from 'next/headers'
import { checkRateLimit } from '@/lib/rate-limit'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') // 'username' or 'email'
  const value = searchParams.get('value')

  if (!type || !value || !['username', 'email'].includes(type)) {
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
  }

  // 1. Rate Limiting (Native Implementation)
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for') || '127.0.0.1'
  const isAllowed = await checkRateLimit(ip)

  if (!isAllowed) {
    return NextResponse.json(
      { message: 'Too many requests' },
      { status: 429 }
    )
  }

  // 2. Database Check via Payload Local API
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'users',
      where: {
        [type]: {
          equals: value,
        },
      },
      limit: 0, // Efficient check (only count)
    })

    const isAvailable = result.totalDocs === 0

    return NextResponse.json({
      available: isAvailable,
      type,
    })
  } catch (error) {
    console.error('Availability check failed:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

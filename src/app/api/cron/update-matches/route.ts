import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Match } from '@/payload-types'

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
  const now = new Date()

  try {
    // 2. Find matches that are scheduled and should be live (start time passed)
    // We look for matches scheduled in the past that are still marked as 'scheduled'
    const matchesToUpdate = await payload.find({
      collection: 'matches',
      where: {
        and: [
          {
            status: {
              equals: 'scheduled',
            },
          },
          {
            date: {
              less_than_equal: now.toISOString(),
            },
          },
        ],
      },
      limit: 100, // Process in batches if necessary, but 100 is likely enough for 5-min intervals
    })

    if (matchesToUpdate.totalDocs === 0) {
      return NextResponse.json({ message: 'No matches to update', count: 0 })
    }

    // 3. Update status to 'live'
    const updatePromises = matchesToUpdate.docs.map((match) =>
      payload.update({
        collection: 'matches',
        id: match.id,
        data: {
          status: 'live',
        },
      })
    )

    await Promise.all(updatePromises)

    const matchTitles = matchesToUpdate.docs.map((m: Match) => m.displayTitle || m.id).join(', ')
    payload.logger.info(`[CRON] Updated ${matchesToUpdate.totalDocs} matches to LIVE: ${matchTitles}`)

    return NextResponse.json({
      message: 'Matches updated successfully',
      count: matchesToUpdate.totalDocs,
      updatedMatches: matchTitles,
    })
  } catch (error) {
    payload.logger.error({ err: error }, '[CRON] Error updating matches')
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

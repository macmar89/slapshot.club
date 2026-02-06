import { BasePayload } from 'payload'
import { Match } from '@/payload-types'

export interface UpdateMatchesResult {
  message: string
  count: number
  updatedMatches?: string
}

/**
 * Service to update scheduled matches to 'live' if their start time has passed.
 */
export async function updateScheduledMatches(payload: BasePayload): Promise<UpdateMatchesResult> {
  const now = new Date()

  try {
    // 1. Find matches that are scheduled and should be live (start time passed)
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
      limit: 100,
    })

    if (matchesToUpdate.totalDocs === 0) {
      return { message: 'No matches to update', count: 0 }
    }

    // 2. Update status to 'live'
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

    const matchTitles = matchesToUpdate.docs.map((m: any) => m.displayTitle || m.id).join(', ')
    payload.logger.info(`[SERVICE] Updated ${matchesToUpdate.totalDocs} matches to LIVE: ${matchTitles}`)

    return {
      message: 'Matches updated successfully',
      count: matchesToUpdate.totalDocs,
      updatedMatches: matchTitles,
    }
  } catch (error) {
    payload.logger.error({ err: error }, '[SERVICE] Error updating matches')
    throw error
  }
}

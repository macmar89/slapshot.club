'use server'

import { getPayload } from 'payload'
import config from '../../payload.config'
import { revalidatePath } from 'next/cache'

export async function joinCompetition(competitionId: string, userId: string) {
  const payload = await getPayload({ config })

  try {
    // Check if entry already exists to prevent duplicates
    const existingEntry = await payload.find({
      collection: 'leaderboard-entries',
      where: {
        and: [
          { user: { equals: userId } },
          { competition: { equals: competitionId } },
        ],
      },
    })

    if (existingEntry.totalDocs > 0) {
      return { ok: true, message: 'Already joined' }
    }

    // Create new leaderboard entry
    await payload.create({
      collection: 'leaderboard-entries',
      data: {
        user: userId,
        competition: competitionId,
        totalPoints: 0,
        totalMatches: 0,
        exactGuesses: 0,
        correctTrends: 0,
      },
    })

    revalidatePath('/lobby')
    return { ok: true }
  } catch (error) {
    console.error('Error joining competition:', error)
    return { ok: false, error: 'Failed to join competition' }
  }
}

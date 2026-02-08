import { TaskHandler } from 'payload'
import { recalculateCompetitionRanks } from '@/features/leaderboard/services/rankingService'

export const runUpdateRealtimeRanking = async (payload: any) => {
  const now = new Date()
  const startOfToday = new Date(new Date(now).setHours(0, 0, 0, 0)).toISOString()

  // 1. Find matches that are finished today and not yet processed for ranking
  const matches = await payload.find({
    collection: 'matches',
    where: {
      and: [
        {
          status: { equals: 'finished' },
        },
        {
          rankedAt: { exists: false },
        },
        {
          date: { greater_than_equal: startOfToday },
        },
      ],
    },
    limit: 100,
  })

  if (matches.totalDocs === 0) {
    return { message: 'No matches to process' }
  }

  // 2. Identify unique competitions that need update
  const competitionIds = Array.from(
    new Set(
      matches.docs.map((m: any) =>
        typeof m.competition === 'string' ? m.competition : m.competition.id,
      ),
    ),
  )

  payload.logger.info(
    `[TASK] Processing realtime ranking for ${competitionIds.length} competitions...`,
  )

  // 3. Recalculate rankings for each competition (without creating snapshots)
  for (const compId of competitionIds) {
    await recalculateCompetitionRanks(payload, compId as string, { createSnapshot: false })
  }

  // 4. Mark matches as processed with current timestamp
  const updatePromises = matches.docs.map((match: any) =>
    payload.update({
      collection: 'matches',
      id: match.id,
      data: {
        rankedAt: now.toISOString(),
      } as any,
    }),
  )
  await Promise.all(updatePromises)

  return {
    message: 'Realtime ranking updated',
    processedMatches: matches.totalDocs,
    competitionsCount: competitionIds.length,
  }
}

export const updateRealtimeRankingTask: TaskHandler<any> = async ({ req: { payload } }) => {
  try {
    const result = await runUpdateRealtimeRanking(payload)
    return {
      output: result,
    }
  } catch (error: any) {
    payload.logger.error(`[TASK ERROR] updateRealtimeRankingTask failed: ${error.message}`)
    throw error
  }
}

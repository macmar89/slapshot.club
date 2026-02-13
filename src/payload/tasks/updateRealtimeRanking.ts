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
    
    // 3.1 Send Push Notification for Leaderboard Update
    try {
      const comp = await payload.findByID({ collection: 'competitions', id: compId as string })
      if (comp) {
        payload.logger.info(`[TASK] Queueing leaderboard update notification for ${comp.name}`)
        await payload.jobs.queue({
          task: 'send-push-notification' as any,
          input: {
            type: 'leaderboardUpdate',
            titles: {
              sk: '📊 Rebríček bol aktualizovaný',
              en: '📊 Leaderboard updated',
              cs: '📊 Žebříček byl aktualizován',
            },
            messages: {
              sk: `Poradie v súťaži ${comp.name} bolo prepočítané. Pozri sa, ako si dopadol!`,
              en: `Rankings for ${comp.name} have been updated. Check your position!`,
              cs: `Pořadí v soutěži ${comp.name} bylo přepočítáno. Podívej se, jak jsi dopadl!`,
            },
            url: `${process.env.NEXT_PUBLIC_SERVER_URL}/dashboard/${comp.slug}/leaderboard`,
            competitionId: comp.id,
          },
        })
      }
    } catch (err: any) {
      payload.logger.error(`[TASK ERROR] Failed to send leaderboard notification: ${err.message}`)
    }
  }

  // 4. Mark matches as processed with current timestamp

  // 4. Mark matches as processed with current timestamp
  // Batch updates to matches to prevent locking the table for too long
  const MATCH_BATCH_SIZE = 10
  for (let i = 0; i < matches.docs.length; i += MATCH_BATCH_SIZE) {
    const batch = matches.docs.slice(i, i + MATCH_BATCH_SIZE)
    const updatePromises = batch.map((match: any) =>
      payload.update({
        collection: 'matches',
        id: match.id,
        data: {
          rankedAt: now.toISOString(),
        } as any,
      }),
    )
    await Promise.all(updatePromises)
  }

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

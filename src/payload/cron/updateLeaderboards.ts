import { BasePayload, TaskHandler } from 'payload'
import { recalculateCompetitionRanks } from '@/features/leaderboard/services/rankingService'

// The core logic
export const runUpdateLeaderboards = async (
  payload: BasePayload,
  options?: { force?: boolean },
) => {
  const now = new Date()
  const currentHour = now.getUTCHours()
  const isForce = options?.force === true

  payload.logger.info(
    `[CRON] Starting updateLeaderboards (Force: ${isForce}) at hour ${currentHour}...`,
  )

  try {
    // 1. Fetch Active Competitions
    const competitions = await payload.find({
      collection: 'competitions',
      where: {
        status: { equals: 'active' },
      },
      limit: 100,
    })

    if (competitions.totalDocs === 0) {
      payload.logger.info('[CRON] No active competitions found.')
      return
    }

    // 2. Fetch Active Memberships for Tie-Breaking
    const memberships = await payload.find({
      collection: 'user-memberships',
      where: {
        status: { equals: 'active' },
      },
      limit: 10000,
      depth: 1,
    })

    const userTierMap = new Map<string, number>()
    memberships.docs.forEach((m: any) => {
      const userId = typeof m.user === 'string' ? m.user : m.user?.id
      const tierRank = typeof m.tier === 'object' ? m.tier?.rank || 0 : 0
      const current = userTierMap.get(userId) || 0
      if (tierRank > current) {
        userTierMap.set(userId, tierRank)
      }
    })

    // 3. Process Each Competition
    for (const comp of competitions.docs) {
      const scheduledHour = (comp as any).recalculationHour ?? 5

      if (!isForce && scheduledHour !== currentHour) {
        continue
      }

      payload.logger.info(`[CRON] Processing competition: ${comp.name}`)

      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      const recentMatches = await payload.find({
        collection: 'matches',
        where: {
          competition: { equals: comp.id },
          status: { equals: 'finished' },
          'result.endingType': { exists: true },
          updatedAt: { greater_than: oneDayAgo.toISOString() },
        },
        limit: 1,
      })

      if (!isForce && recentMatches.totalDocs === 0) {
        payload.logger.info(`[CRON] No recent matches in ${comp.name}, skipping recalculation.`)
        continue
      }

      await recalculateCompetitionRanks(payload, comp.id, { createSnapshot: true })
      
      // Send Push Notification for Leaderboard Update
      try {
        payload.logger.info(`[CRON] Queueing leaderboard update notification for ${comp.name}`)
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
              sk: `Denný rebríček v súťaži ${comp.name} bol aktualizovaný. Pozri sa na aktuálne poradie!`,
              en: `Daily rankings for ${comp.name} have been updated. Check current standings!`,
              cs: `Denní žebříček v soutěži ${comp.name} byl aktualizován. Podívej se na aktuální pořadí!`,
            },
            url: `${process.env.NEXT_PUBLIC_SERVER_URL}/dashboard/${comp.slug}/leaderboard`,
            competitionId: comp.id,
          },
        })
      } catch (err: any) {
        payload.logger.error(`[CRON ERROR] Failed to send leaderboard notification for ${comp.name}: ${err.message}`)
      }

      payload.logger.info(`[CRON] Updated entries for ${comp.name}`)
    }
  } catch (error: any) {
    payload.logger.error(`[CRON ERROR] updateLeaderboards failed: ${error.message}`)
  }
}

export const updateLeaderboardsTask: TaskHandler<any> = async ({ input, req: { payload } }) => {
  await runUpdateLeaderboards(payload, { force: input?.force })
  return {
    output: { message: 'Leaderboards updated' },
  }
}
